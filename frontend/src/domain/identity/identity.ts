export const nullProfile: Profile = {
    identity: {
        email: { addresses: [] },
        phone: { numbers: [] },
    },
    apps: [],
};

export function addPhoneNumber(profile: Profile, phoneNumber: Verifiable<PhoneNumber>): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            phone: {
                numbers: [phoneNumber, ...profile.identity.phone.numbers],
            },
        },
    };
}

export function removePhoneNumber(profile: Profile, id: bigint): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            phone: {
                numbers: profile.identity.phone.numbers.filter((n) => n.id !== id),
            },
        },
    };
}

export type Profile = {
    identity: Identity;
    apps: ClientApp[];
};

export type ClientApp = {
    domainName: string;
};

export type Identity = {
    email: EmailFacet;
    phone: PhoneFacet;
};

export type EmailFacet = {
    addresses: Verifiable<string>[];
};

export type PhoneFacet = {
    numbers: Verifiable<PhoneNumber>[];
};

export type PhoneNumber = {
    countryCode: number;
    number: string;
};

export type Verifiable<T> = {
    id: bigint;
    status: VerificationCodeStatus;
    added: bigint;
    value: T;
};

export type VerificationCodeStatus = "pending" | "sent" | "verified";

export type RegisterPhoneResponse =
    | RegisterPhoneSuccess
    | RegisterPhoneAlreadyRegistered
    | RegisterPhoneInvalid;

export type RegisterPhoneSuccess = {
    kind: "register_phone_success";
    id: bigint;
};

export type RegisterPhoneAlreadyRegistered = {
    kind: "register_phone_already_registered";
};

export type RegisterPhoneInvalid = {
    kind: "register_phone_invalid";
};

export type SendCodeResponse = "success" | "already_sent" | "not_found";

export type ConfirmCodeResponse =
    | "success"
    | "code_incorrect"
    | "code_expired"
    | "already_confirmed"
    | "not_sent"
    | "not_found";
