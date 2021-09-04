import type {
    ConfirmCodeResponse,
    PhoneNumber,
    Profile,
    RegisterAttributeResponse,
    SendCodeResponse,
    VisibleProfileAttributesResponse,
} from "../../domain/identity/identity";

export interface IIdentityClient {
    getProfile(): Promise<Profile>;
    registerPhoneNumber(phoneNumber: PhoneNumber): Promise<RegisterAttributeResponse>;
    registerEmailAddress(address: string): Promise<RegisterAttributeResponse>;
    sendVerificationCode(id: bigint): Promise<SendCodeResponse>;
    confirmVerificationCode(id: bigint, code: string): Promise<ConfirmCodeResponse>;
    visibleProfileAttributes(domainName: string): Promise<VisibleProfileAttributesResponse>;
}
