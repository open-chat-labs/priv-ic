import type {
    ApiApp,
    ApiConfirmVerificationCodeResponse,
    ApiEmailFacet,
    ApiIdentity,
    ApiPhoneFacet,
    ApiPhoneNumber,
    ApiProfileResponse,
    ApiRegisterEmailResponse,
    ApiRegisterPhoneNumberResponse,
    ApiSendVerificationCodeResponse,
    ApiVerificationCodeStatus,
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
    RegisterPhoneResponse,
    SendCodeResponse,
    ConfirmCodeResponse,
    RegisterEmailResponse,
} from "../../domain/identity/identity";
import { UnsupportedValueError } from "../../utils/error";

export function confirmCodeResponse(
    candid: ApiConfirmVerificationCodeResponse
): ConfirmCodeResponse {
    if ("Success" in candid) {
        return "success";
    }
    if ("NotSent" in candid) {
        return "not_sent";
    }
    if ("NotFound" in candid) {
        return "not_found";
    }
    if ("AlreadyConfirmed" in candid) {
        return "already_confirmed";
    }
    if ("ConfirmationCodeExpired" in candid) {
        return "code_expired";
    }
    if ("ConfirmationCodeIncorrect" in candid) {
        return "code_incorrect";
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

export function registerEmailResponse(candid: ApiRegisterEmailResponse): RegisterEmailResponse {
    if ("Success" in candid) {
        return {
            kind: "register_email_success",
            id: candid.Success.attribute_id,
        };
    }
    if ("AlreadyRegistered" in candid) {
        return {
            kind: "register_email_already_registered",
        };
    }
    if ("InvalidEmailAddress" in candid) {
        return {
            kind: "register_email_invalid",
        };
    }
    throw new UnsupportedValueError("Unexpected register phone response type returned", candid);
}

export function registerPhoneResponse(
    candid: ApiRegisterPhoneNumberResponse
): RegisterPhoneResponse {
    if ("Success" in candid) {
        return {
            kind: "register_phone_success",
            id: candid.Success.attribute_id,
        };
    }
    if ("AlreadyRegistered" in candid) {
        return {
            kind: "register_phone_already_registered",
        };
    }
    if ("InvalidPhoneNumber" in candid) {
        return {
            kind: "register_phone_invalid",
        };
    }
    throw new UnsupportedValueError("Unexpected register phone response type returned", candid);
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
