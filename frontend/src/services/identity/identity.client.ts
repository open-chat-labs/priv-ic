import type { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory, IdentityService } from "./candid/idl";
import type {
} from "../../domain/identity/identity";
import { CandidService } from "../candidService";
import {
} from "./mappers";
import type { IIdentityClient } from "./identity.client.interface";
import { IdentityClientMock } from "./identity.client.mock";

export class IdentityClient extends CandidService implements IIdentityClient {
    private identityService: IdentityService;

    constructor(identity: Identity) {
        super(identity);
        this.identityService = this.createServiceClient<IdentityService>(idlFactory, 
                       "process.env.IDENTITY_CANISTER_ID" 
            );
    }

    static create(identity: Identity): IIdentityClient {
        if (process.env.MOCK_SERVICES) {
            return new IdentityClientMock();
        }
        return new IdentityClient(identity);
    }
}
