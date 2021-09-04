import type { IDL } from "@dfinity/candid";
import {
    _SERVICE,
    ProfileResponse,
    Identity,
    App,
    EmailFacet,
    PhoneFacet,
    PhoneNumber,
    VerificationCodeStatus,
    RegisterAttributeResponse,
    SendVerificationCodeResponse,
    ConfirmVerificationCodeResponse,
    VisibleProfileAttributesResponse,
} from "./types";
export {
    _SERVICE as IdentityService,
    ProfileResponse as ApiProfileResponse,
    Identity as ApiIdentity,
    App as ApiApp,
    EmailFacet as ApiEmailFacet,
    PhoneFacet as ApiPhoneFacet,
    PhoneNumber as ApiPhoneNumber,
    VerificationCodeStatus as ApiVerificationCodeStatus,
    RegisterAttributeResponse as ApiRegisterAttributeResponse,
    SendVerificationCodeResponse as ApiSendVerificationCodeResponse,
    ConfirmVerificationCodeResponse as ApiConfirmVerificationCodeResponse,
    VisibleProfileAttributesResponse as ApiVisibleProfileAttributesResponse,
};

export const idlFactory: IDL.InterfaceFactory;
