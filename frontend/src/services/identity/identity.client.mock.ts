import {
    nullProfile,
    PhoneNumber,
    addPhoneNumber,
    Profile,
    RegisterAttributeResponse,
    SendCodeResponse,
    ConfirmCodeResponse,
    addEmailAddress,
    VisibleProfileAttributesResponse,
    VerificationCodeStatus,
    SetVisibleProfileAttributesResponse,
    distrikt,
    openchat,
    dscvr,
    RemoveAttributeResponse,
    DelegationResponse,
} from "../../domain/identity/identity";
import type { IIdentityClient } from "./identity.client.interface";
import { v1 as uuidv1 } from "uuid";

type VisibilityCache = Record<string, bigint[]>;

export function newFieldId(): bigint {
    return BigInt(parseInt(uuidv1().replace(/-/g, ""), 16));
}

export class IdentityClientMock implements IIdentityClient {
    private _nextId: bigint;
    private _profile: Profile;
    private _visibility: VisibilityCache;

    constructor() {
        const cachedId = localStorage.getItem("privic_id");
        if (!cachedId) {
            this._nextId = BigInt(0);
        } else {
            console.log(cachedId);
            this._nextId = BigInt(parseInt(cachedId, 10));
        }

        const cachedProfile = localStorage.getItem("privic_profile");
        if (!cachedProfile) {
            this._profile = {
                ...nullProfile,
                apps: [{ domainName: distrikt }, { domainName: openchat }, { domainName: dscvr }],
            };
        } else {
            this._profile = JSON.parse(cachedProfile);
        }

        const cachedVis = localStorage.getItem("privic_vis");
        if (!cachedVis) {
            this._visibility = {
                [openchat]: [],
            };
        } else {
            this._visibility = JSON.parse(cachedVis);
        }
    }

    prepareDelegation(
        _hostname: string,
        _key: Uint8Array,
        _maxTimeToLive?: bigint
    ): Promise<[Uint8Array, bigint]> {
        // we can't really meaningfully mock this
        throw new Error("Method not implemented.");
    }

    getDelegation(
        _hostname: string,
        _key: Uint8Array,
        _maxTimeToLive?: bigint
    ): Promise<DelegationResponse> {
        // we can't really meaningfully mock this
        throw new Error("Method not implemented.");
    }

    private save(): void {
        localStorage.setItem("privic_profile", JSON.stringify(this._profile));
        localStorage.setItem("privic_vis", JSON.stringify(this._visibility));
        localStorage.setItem("privic_id", this._nextId.toString());
    }

    private updateStatus(id: bigint, status: VerificationCodeStatus): void {
        this._profile.identity.email.addresses.forEach((x) => {
            if (x.id === id) {
                x.status = status;
            }
        });
        this._profile.identity.phone.numbers.forEach((x) => {
            if (x.id === id) {
                x.status = status;
            }
        });
    }

    removeAttribute(id: bigint): Promise<RemoveAttributeResponse> {
        this._profile.identity.email.addresses = this._profile.identity.email.addresses.filter(
            (a) => a.id !== id
        );
        this._profile.identity.phone.numbers = this._profile.identity.phone.numbers.filter(
            (a) => a.id !== id
        );
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res("remove_success");
            }, 1000);
        });
    }

    confirmVerificationCode(id: bigint, _code: string): Promise<ConfirmCodeResponse> {
        this.updateStatus(id, "verified");
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res("success");
            }, 1000);
        });
    }

    sendVerificationCode(id: bigint): Promise<SendCodeResponse> {
        this.updateStatus(id, "sent");
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res("success");
            }, 1000);
        });
    }

    registerEmailAddress(address: string): Promise<RegisterAttributeResponse> {
        this._profile = addEmailAddress(this._profile, {
            id: this._nextId++,
            status: "pending",
            added: BigInt(+new Date()),
            value: address,
        });
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_attribute_success",
                    id: this._nextId,
                });
            }, 1000);
        });
    }

    registerPhoneNumber(phoneNumber: PhoneNumber): Promise<RegisterAttributeResponse> {
        console.log("Registering phone number");
        this._profile = addPhoneNumber(this._profile, {
            id: this._nextId++,
            status: "pending",
            added: BigInt(+new Date()),
            value: phoneNumber,
        });
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_attribute_success",
                    id: this._nextId,
                });
            }, 1000);
        });
    }

    visibleProfileAttributes(domainName: string): Promise<VisibleProfileAttributesResponse> {
        return new Promise((res) => {
            setTimeout(() => {
                res(this._visibility[domainName] ?? []);
            }, 1000);
        });
    }

    setVisibleProfileAttributes(
        domainName: string,
        attributes: bigint[]
    ): Promise<SetVisibleProfileAttributesResponse> {
        this._visibility[domainName] = attributes;
        this.save();
        return new Promise((res) => {
            setTimeout(() => {
                res("success");
            }, 1000);
        });
    }

    getProfile(): Promise<Profile> {
        console.log("Getting mock profile");
        return new Promise((res) => {
            setTimeout(() => {
                res(this._profile);
            }, 1000);
        });
    }
}
