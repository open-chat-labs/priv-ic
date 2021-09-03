import type { Identity } from "@dfinity/agent";
import { IdentityClient } from "./identity/identity.client";
import { IIdentityClient } from "./identity/identity.client.interface";

export class ServiceContainer {
    private _identityClient: IIdentityClient;

    constructor(private identity: Identity) {
        this._identityClient = IdentityClient.create(identity);
    }
}
