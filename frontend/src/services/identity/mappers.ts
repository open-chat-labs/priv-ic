import type {
    ApiApp,
    ApiConfirmVerificationCodeResponse,
    ApiEmailFacet,
    ApiIdentity,
    ApiPhoneFacet,
    ApiPhoneNumber,
    ApiProfileResponse,
    ApiRegisterAttributeResponse,
    ApiSendVerificationCodeResponse,
    ApiVisibleAttributesResponse,
    ApiVerificationCodeStatus,
    ApiSetVisibleAttributesResponse,
    ApiRemoveAttributeResponse,
    ApiDelegationResponse,
} from "./candid/idl";
import {
    nullProfile,
    Profile,
    Identity,
    ClientApp,
    EmailFacet,
    PhoneFacet,
    VerificationCodeStatus,
    PhoneNumber,
    RegisterAttributeResponse,
    SendCodeResponse,
    ConfirmCodeResponse,
    VisibleProfileAttributesResponse,
    SetVisibleProfileAttributesResponse,
    RemoveAttributeResponse,
    DelegationResponse,
} from "../../domain/identity/identity";
import { UnsupportedValueError } from "../../utils/error";

export function setVisibleProfileAttributesResponse(
    _candid: ApiSetVisibleAttributesResponse
): SetVisibleProfileAttributesResponse {
    return "success";
}

export function visibleProfileAttributesResponse(
    candid: ApiVisibleAttributesResponse
): VisibleProfileAttributesResponse {
    if ("Success" in candid) {
        return candid.Success.attributes;
    }

    if ("ApplicationNotRegistered" in candid) {
        return "application_not_registered";
    }

    throw new UnsupportedValueError(
        "Unexpected visible profile attributes response type returned",
        candid
    );
}

export function confirmCodeResponse(
    candid: ApiConfirmVerificationCodeResponse
): ConfirmCodeResponse {
    if ("Success" in candid) {
        return "success";
    }
    if ("NotSent" in candid) {
        return "not_sent";
    }
    if ("IdentityNotFound" in candid) {
        return "identity_not_found";
    }
    if ("AttributeNotFound" in candid) {
        return "attribute_not_found";
    }
    if ("AlreadyVerified" in candid) {
        return "already_verified";
    }
    if ("VerificationCodeExpired" in candid) {
        return "code_expired";
    }
    if ("VerificationCodeIncorrect" in candid) {
        return "code_incorrect";
    }
    if ("VerificationCodeInvalid" in candid) {
        return "code_invalid";
    }
    throw new UnsupportedValueError(
        "Unexpected confirm verification code response type returned",
        candid
    );
}

export function sendCodeResponse(candid: ApiSendVerificationCodeResponse): SendCodeResponse {
    if ("Success" in candid) {
        return "success";
    }
    if ("AlreadySent" in candid) {
        return "already_sent";
    }
    if ("AlreadyVerified" in candid) {
        return "already_verified";
    }
    if ("AttributeNotFound" in candid) {
        return "attribute_not_found";
    }
    if ("IdentityNotFound" in candid) {
        return "identity_not_found";
    }
    if ("Unsupported" in candid) {
        return "unsupported";
    }
    throw new UnsupportedValueError(
        "Unexpected send verification code response type returned",
        candid
    );
}

export function delegationResponse(candid: ApiDelegationResponse): DelegationResponse {
    console.log("delegation response: ", candid);
    if ("no_such_delegation" in candid) {
        return "no_such_delegation";
    }
    if ("signed_delegation" in candid) {
        return candid.signed_delegation;
    }
    throw new UnsupportedValueError("Unexpected delegation response type returned", candid);
}

export function removeAttributeResponse(
    candid: ApiRemoveAttributeResponse
): RemoveAttributeResponse {
    if ("Success" in candid) {
        return "remove_success";
    }
    if ("AttributeNotFound" in candid) {
        return "remove_attribute_not_found";
    }
    if ("IdentityNotFound" in candid) {
        return "remove_identity_not_found";
    }
    throw new UnsupportedValueError("Unexpected remove attribute response type returned", candid);
}

export function registerAttributeResponse(
    candid: ApiRegisterAttributeResponse
): RegisterAttributeResponse {
    if ("Success" in candid) {
        return {
            kind: "register_attribute_success",
            id: candid.Success.attribute_id,
        };
    }
    if ("AlreadyRegistered" in candid) {
        return {
            kind: "register_attribute_already_registered",
        };
    }
    if ("InvalidValue" in candid) {
        return {
            kind: "register_attribute_invalid",
        };
    }
    throw new UnsupportedValueError("Unexpected register attribute response type returned", candid);
}

export function profile(candid: ApiProfileResponse): Profile {
    if ("Success" in candid) {
        return {
            identity: getIdentity(candid.Success.identity),
            apps: candid.Success.apps.map(getApp),
        };
    }
    if ("NotFound" in candid) {
        return nullProfile;
    }
    throw new UnsupportedValueError("Unexpected profile response type returned", candid);
}

function getApp(candid: ApiApp): ClientApp {
    return {
        domainName: candid.domain_name,
    };
}

function getIdentity(candid: ApiIdentity): Identity {
    return {
        email: emailFacet(candid.email),
        phone: phoneFacet(candid.phone),
    };
}

function emailFacet(candid: ApiEmailFacet): EmailFacet {
    return {
        addresses: candid.addresses.map((a) => ({
            id: a.id,
            status: verificationStatus(a.status),
            added: a.added,
            value: a.value,
        })),
    };
}

function phoneFacet(candid: ApiPhoneFacet): PhoneFacet {
    return {
        numbers: candid.numbers.map((n) => ({
            id: n.id,
            status: verificationStatus(n.status),
            added: n.added,
            value: phoneNumber(n.value),
        })),
    };
}

function phoneNumber(candid: ApiPhoneNumber): PhoneNumber {
    return {
        countryCode: candid.country_code,
        number: candid.number,
    };
}

function verificationStatus(candid: ApiVerificationCodeStatus): VerificationCodeStatus {
    if ("Sent" in candid) {
        return "sent";
    }
    if ("Verified" in candid) {
        return "verified";
    }
    if ("Pending" in candid) {
        return "pending";
    }
    if ("Expired" in candid) {
        return "expired";
    }
    throw new UnsupportedValueError("Unexpected verification code type returned", candid);
}
