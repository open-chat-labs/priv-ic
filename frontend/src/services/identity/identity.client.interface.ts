import type {
    ConfirmCodeResponse,
    DelegationResponse,
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
    prepareDelegation(
        hostname: string,
        key: Uint8Array,
        maxTimeToLive?: bigint
    ): Promise<[Uint8Array, bigint]>;
    getDelegation(
        hostname: string,
        key: Uint8Array,
        maxTimeToLive?: bigint
    ): Promise<DelegationResponse>;
}
