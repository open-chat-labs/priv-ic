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

export interface IIdentityClient {
    getProfile(): Promise<Profile>;
    registerPhoneNumber(phoneNumber: PhoneNumber): Promise<RegisterAttributeResponse>;
    removeAttribute(id: bigint): Promise<RemoveAttributeResponse>;
    registerEmailAddress(address: string): Promise<RegisterAttributeResponse>;
    sendVerificationCode(id: bigint): Promise<SendCodeResponse>;
    confirmVerificationCode(id: bigint, code: string): Promise<ConfirmCodeResponse>;
    visibleProfileAttributes(domainName: string): Promise<VisibleProfileAttributesResponse>;
    setVisibleProfileAttributes(
        domainName: string,
        attributes: bigint[]
    ): Promise<SetVisibleProfileAttributesResponse>;
}
