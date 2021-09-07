import { AnonymousIdentity, Identity, SignIdentity } from "@dfinity/agent";
import { isDelegationValid } from "@dfinity/authentication";
import { blobFromUint8Array, derBlobFromBlob } from "@dfinity/candid";
import {
    Delegation,
    DelegationChain,
    DelegationIdentity,
    Ed25519KeyIdentity,
} from "@dfinity/identity";
import type { Principal } from "@dfinity/principal";
import { IdentityClient } from "../services/identity/identity.client";

const KEY_LOCALSTORAGE_KEY = "identity";
const KEY_LOCALSTORAGE_DELEGATION = "delegation";
const IDENTITY_PROVIDER_DEFAULT = "https://identity.ic0.app";
const IDENTITY_PROVIDER_ENDPOINT = "#authorize";

/**
 * List of options for creating an {@link AuthClient}.
 */
export interface AuthClientCreateOptions {
    /**
     * An identity to use as the base
     */
    identity?: SignIdentity;
    /**
     * Optional storage with get, set, and remove. Uses LocalStorage by default
     */
    storage?: AuthClientStorage;
}

export interface AuthClientLoginOptions {
    /**
     * Identity provider. By default, use the identity service.
     */
    identityProvider?: string | URL;
    /**
     * Experiation of the authentication
     */
    maxTimeToLive?: bigint;
    /**
     * Callback once login has completed
     */
    onSuccess?: () => void;
    /**
     * Callback in case authentication fails
     */
    onError?: (error?: string) => void;
}

/**
 * Interface for persisting user authentication data
 */
export interface AuthClientStorage {
    get(key: string): Promise<string | null>;

    set(key: string, value: string): Promise<void>;

    remove(key: string): Promise<void>;
}

interface InternetIdentityAuthRequest {
    kind: "authorize-client";
    sessionPublicKey: Uint8Array;
    maxTimeToLive?: bigint;
}

interface InternetIdentityAuthResponseSuccess {
    kind: "authorize-client-success";
    delegations: {
        delegation: {
            pubkey: Uint8Array;
            expiration: bigint;
            targets?: Principal[];
        };
        signature: Uint8Array;
    }[];
    userPublicKey: Uint8Array;
}

async function _deleteStorage(storage: AuthClientStorage) {
    await storage.remove(KEY_LOCALSTORAGE_KEY);
    await storage.remove(KEY_LOCALSTORAGE_DELEGATION);
}

export class LocalStorage implements AuthClientStorage {
    constructor(public readonly prefix = "ic-", private readonly _localStorage?: Storage) {}

    public get(key: string): Promise<string | null> {
        return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
    }

    public set(key: string, value: string): Promise<void> {
        this._getLocalStorage().setItem(this.prefix + key, value);
        return Promise.resolve();
    }

    public remove(key: string): Promise<void> {
        this._getLocalStorage().removeItem(this.prefix + key);
        return Promise.resolve();
    }

    private _getLocalStorage() {
        if (this._localStorage) {
            return this._localStorage;
        }

        const ls =
            typeof window === "undefined"
                ? typeof global === "undefined"
                    ? typeof self === "undefined"
                        ? undefined
                        : self.localStorage
                    : global.localStorage
                : window.localStorage;

        if (!ls) {
            throw new Error("Could not find local storage.");
        }

        return ls;
    }
}

interface AuthReadyMessage {
    kind: "authorize-ready";
}

interface AuthResponseSuccess {
    kind: "authorize-client-success";
    delegations: {
        delegation: {
            pubkey: Uint8Array;
            expiration: bigint;
            targets?: Principal[];
        };
        signature: Uint8Array;
    }[];
    userPublicKey: Uint8Array;
}

interface AuthResponseFailure {
    kind: "authorize-client-failure";
    text: string;
}

type IdentityServiceResponseMessage = AuthReadyMessage | AuthResponse;
type AuthResponse = AuthResponseSuccess | AuthResponseFailure;

export class AuthClient {
    public static async create(options: AuthClientCreateOptions = {}): Promise<AuthClient> {
        const storage = options.storage ?? new LocalStorage("ic-");

        let key: null | SignIdentity = null;
        if (options.identity) {
            key = options.identity;
        } else {
            const maybeIdentityStorage = await storage.get(KEY_LOCALSTORAGE_KEY);
            if (maybeIdentityStorage) {
                try {
                    key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
                } catch (e) {
                    // Ignore this, this means that the localStorage value isn't a valid Ed25519KeyIdentity
                    // serialization.
                }
            }
        }

        let identity = new AnonymousIdentity();
        let chain: null | DelegationChain = null;

        if (key) {
            try {
                const chainStorage = await storage.get(KEY_LOCALSTORAGE_DELEGATION);

                if (chainStorage) {
                    chain = DelegationChain.fromJSON(chainStorage);

                    // Verify that the delegation isn't expired.
                    if (!isDelegationValid(chain)) {
                        await _deleteStorage(storage);
                        key = null;
                    } else {
                        identity = DelegationIdentity.fromDelegation(key, chain);
                    }
                }
            } catch (e) {
                console.error(e);
                // If there was a problem loading the chain, delete the key.
                await _deleteStorage(storage);
                key = null;
            }
        }

        return new this(identity, key, chain, storage);
    }

    protected constructor(
        private _identity: Identity,
        private _key: SignIdentity | null,
        private _chain: DelegationChain | null,
        private _storage: AuthClientStorage,
        // A handle on the IdP window.
        private _idpWindow?: Window,
        // The event handler for processing events from the IdP.
        private _eventHandler?: (event: MessageEvent) => void,
        private _authSuccess?: InternetIdentityAuthResponseSuccess,
        private _authRequest?: InternetIdentityAuthRequest
    ) {}

    private _handleSuccess(
        message: InternetIdentityAuthResponseSuccess,
        onSuccess?: () => void
    ): void {
        const delegations = message.delegations.map((signedDelegation) => {
            return {
                delegation: new Delegation(
                    blobFromUint8Array(signedDelegation.delegation.pubkey),
                    signedDelegation.delegation.expiration,
                    signedDelegation.delegation.targets
                ),
                signature: blobFromUint8Array(signedDelegation.signature),
            };
        });

        const delegationChain = DelegationChain.fromDelegations(
            delegations,
            derBlobFromBlob(blobFromUint8Array(message.userPublicKey))
        );

        const key = this._key;
        if (!key) {
            throw new Error("no key");
        }

        this._chain = delegationChain;

        this._identity = DelegationIdentity.fromDelegation(key, this._chain);

        this._idpWindow?.close();
        onSuccess?.();
        this._removeEventListener();
    }

    public getIdentity(): Identity {
        return this._identity;
    }

    public async isAuthenticated(): Promise<boolean> {
        return !this.getIdentity().getPrincipal().isAnonymous() && this._chain !== null;
    }

    public async login(options?: AuthClientLoginOptions): Promise<void> {
        let key = this._key;
        if (!key) {
            // Create a new key (whether or not one was in storage).
            key = Ed25519KeyIdentity.generate();
            this._key = key;
            await this._storage.set(KEY_LOCALSTORAGE_KEY, JSON.stringify(key));
        }

        // Create the URL of the IDP. (e.g. https://XXXX/#authorize)
        const identityProviderUrl = new URL(
            options?.identityProvider?.toString() || IDENTITY_PROVIDER_DEFAULT
        );
        // Set the correct hash if it isn't already set.
        identityProviderUrl.hash = IDENTITY_PROVIDER_ENDPOINT;

        // If `login` has been called previously, then close/remove any previous windows
        // and event listeners.
        this._idpWindow?.close();
        this._removeEventListener();

        // Add an event listener to handle responses.
        this._eventHandler = this._getEventHandler(identityProviderUrl, options);
        window.addEventListener("message", this._eventHandler);

        // Open a new window with the IDP provider.
        this._idpWindow = window.open(identityProviderUrl.toString(), "idpWindow") ?? undefined;
    }

    private async createDelegation(): Promise<void> {
        if (this._authRequest) {
            const client = IdentityClient.create(this._identity);
            const [userKey, ttl] = await client.prepareDelegation(
                window.parent.origin,
                this._authRequest?.sessionPublicKey,
                this._authRequest?.maxTimeToLive
            );
            const signedDelegation = await client.getDelegation(window.parent.origin, userKey, ttl);
            if (signedDelegation === "no_such_delegation") {
                throw Error("Couldn't create delegation");
            }

            const parsed_signed_delegation = {
                delegation: {
                    pubkey: Uint8Array.from(signedDelegation.delegation.pubkey),
                    expiration: BigInt(signedDelegation.delegation.expiration),
                    targets: undefined,
                },
                signature: Uint8Array.from(signedDelegation.signature),
            };

            // todo do we need to add this to the list of delegations rather than just creating a new list
            this._authSuccess = {
                kind: "authorize-client-success",
                delegations: [parsed_signed_delegation],
                userPublicKey: Uint8Array.from(userKey),
            };
        }
    }

    public async returnToClientApp(): Promise<void> {
        if (window.parent) {
            // todo - not restricting the origin here is very dodgy but it doesn't work otherwise
            // not sure why
            await this.createDelegation();
            if (this._authSuccess) {
                window.parent.postMessage(this._authSuccess, "*");
            }
        }
    }

    private _getEventHandler(identityProviderUrl: URL, options?: AuthClientLoginOptions) {
        return async (event: MessageEvent) => {
            // todo - we need to restrict this but how?
            // if (event.origin !== identityProviderUrl.origin) {
            //     return;
            // }

            const message = event.data as
                | IdentityServiceResponseMessage
                | InternetIdentityAuthRequest;

            console.log("received message in privIC: ", message);
            switch (message.kind) {
                case "authorize-client": {
                    // this comes from the calling system and contains the sessionPublicKey
                    // and maxTTL that we will need later to create a delegation
                    // so we need to tuck that away
                    this._authRequest = message;
                    this._idpWindow?.postMessage(message, identityProviderUrl.origin);
                    break;
                }
                case "authorize-ready": {
                    // just relay this to the opener
                    if (window.parent) {
                        window.parent.postMessage(message, "*");
                    }
                    break;
                }
                case "authorize-client-success":
                    // relay success back to the caller
                    // Create the delegation chain and store it.
                    try {
                        this._handleSuccess(message, options?.onSuccess);

                        if (this._chain) {
                            await this._storage.set(
                                KEY_LOCALSTORAGE_DELEGATION,
                                JSON.stringify(this._chain.toJSON())
                            );
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        this._handleFailure(err.message, options?.onError);
                    }
                    break;
                case "authorize-client-failure":
                    this._handleFailure(message.text, options?.onError);
                    break;
                default:
                    break;
            }
        };
    }

    private _handleFailure(errorMessage?: string, onError?: (error?: string) => void): void {
        this._idpWindow?.close();
        onError?.(errorMessage);
        this._removeEventListener();
    }

    private _removeEventListener() {
        if (this._eventHandler) {
            window.removeEventListener("message", this._eventHandler);
        }
        this._eventHandler = undefined;
    }

    public async logout(options: { returnTo?: string } = {}): Promise<void> {
        _deleteStorage(this._storage);

        // Reset this auth client to a non-authenticated state.
        this._identity = new AnonymousIdentity();
        this._key = null;
        this._chain = null;
        this._authSuccess = undefined;

        if (options.returnTo) {
            try {
                window.history.pushState({}, "", options.returnTo);
            } catch (e) {
                window.location.href = options.returnTo;
            }
        }
    }
}
