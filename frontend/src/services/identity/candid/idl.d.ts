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
    VisibleAttributesResponse,
    SetVisibleAttributesResponse,
    RemoveAttributeResponse,
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
    VisibleAttributesResponse as ApiVisibleAttributesResponse,
    SetVisibleAttributesResponse as ApiSetVisibleAttributesResponse,
    RemoveAttributeResponse as ApiRemoveAttributeResponse,
};

export const idlFactory: IDL.InterfaceFactory;
