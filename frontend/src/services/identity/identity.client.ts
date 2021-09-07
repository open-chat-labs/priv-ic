import type { Identity } from "@dfinity/agent";
import { idlFactory, IdentityService } from "./candid/idl";
import type {
    ConfirmCodeResponse,
    PhoneNumber,
    Profile,
    RegisterAttributeResponse,
    RemoveAttributeResponse,
    SendCodeResponse,
    SetVisibleProfileAttributesResponse,
    VisibleProfileAttributesResponse,
} from "../../domain/identity/identity";
import { CandidService } from "../candidService";
import {
    confirmCodeResponse,
    profile,
    registerAttributeResponse,
    removeAttributeResponse,
    sendCodeResponse,
    setVisibleProfileAttributesResponse,
    visibleProfileAttributesResponse,
} from "./mappers";
import type { IIdentityClient } from "./identity.client.interface";
import { IdentityClientMock } from "./identity.client.mock";

export class IdentityClient extends CandidService implements IIdentityClient {
    private identityService: IdentityService;

    constructor(identity: Identity) {
        super(identity);
        this.identityService = this.createServiceClient<IdentityService>(
            idlFactory,
            "process.env.IDENTITY_CANISTER_ID"
        );
    }
    static create(identity: Identity): IIdentityClient {
        if (process.env.MOCK_SERVICES) {
            return new IdentityClientMock();
        }
        return new IdentityClient(identity);
    }
    getProfile(): Promise<Profile> {
        return this.handleResponse(this.identityService.profile({}), profile);
    }
    removeAttribute(id: bigint): Promise<RemoveAttributeResponse> {
        return this.handleResponse(
            this.identityService.remove_attribute({
                attribute_id: id,
            }),
            removeAttributeResponse
        );
    }
    registerPhoneNumber(phoneNumber: PhoneNumber): Promise<RegisterAttributeResponse> {
        return this.handleResponse(
            this.identityService.register_attribute({
                value: {
                    Phone: {
                        country_code: phoneNumber.countryCode,
                        number: phoneNumber.number,
                    },
                },
            }),
            registerAttributeResponse
        );
    }
    registerEmailAddress(address: string): Promise<RegisterAttributeResponse> {
        return this.handleResponse(
            this.identityService.register_attribute({
                value: {
                    Email: address,
                },
            }),
            registerAttributeResponse
        );
    }
    sendVerificationCode(id: bigint): Promise<SendCodeResponse> {
        return this.handleResponse(
            this.identityService.send_verification_code({
                attribute_id: id,
            }),
            sendCodeResponse
        );
    }
    confirmVerificationCode(id: bigint, code: string): Promise<ConfirmCodeResponse> {
        return this.handleResponse(
            this.identityService.confirm_verification_code({
                attribute_id: id,
                verification_code: code,
            }),
            confirmCodeResponse
        );
    }
    visibleProfileAttributes(domainName: string): Promise<VisibleProfileAttributesResponse> {
        return this.handleResponse(
            this.identityService.visible_attributes({
                app_domain_name: domainName,
            }),
            visibleProfileAttributesResponse
        );
    }
    setVisibleProfileAttributes(
        domainName: string,
        attributes: bigint[]
    ): Promise<SetVisibleProfileAttributesResponse> {
        return this.handleResponse(
            this.identityService.set_visible_attributes({
                app_domain_name: domainName,
                attributes: attributes,
            }),
            setVisibleProfileAttributesResponse
        );
    }
}
