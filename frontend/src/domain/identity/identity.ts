export const distrikt = "https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/";
export const openchat = "https://7e6iv-biaaa-aaaaf-aaada-cai.ic0.app/";
export const dscvr = "https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/";

export const appLookup: Record<string, string> = {
    [distrikt]: "Distrikt",
    [openchat]: "OpenChat",
    [dscvr]: "Dscvr",
};

export const nullProfile: Profile = {
    identity: {
        email: { addresses: [] },
        phone: { numbers: [] },
    },
    apps: [],
};

export function addEmailAddress(profile: Profile, address: Verifiable<string>): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            email: {
                addresses: [address, ...profile.identity.email.addresses],
            },
        },
    };
}

export function removeEmailAddress(profile: Profile, id: bigint): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            email: {
                addresses: profile.identity.email.addresses.filter((n) => n.id !== id),
            },
        },
    };
}

export function updatePhoneStatus(
    profile: Profile,
    id: bigint,
    status: VerificationCodeStatus
): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            phone: {
                numbers: profile.identity.phone.numbers.map((n) => {
                    if (n.id === id) {
                        return {
                            ...n,
                            status,
                        };
                    }
                    return n;
                }),
            },
        },
    };
}

export function updateEmailStatus(
    profile: Profile,
    id: bigint,
    status: VerificationCodeStatus
): Profile {
    return {
        ...profile,
        identity: {
            ...profile.identity,
            email: {
                addresses: profile.identity.email.addresses.map((n) => {
                    if (n.id === id) {
                        return {
                            ...n,
                            status,
                        };
                    }
                    return n;
                }),
            },
        },
    };
}

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

export type VerificationCodeStatus = "pending" | "sent" | "verified" | "expired";

export type RemoveAttributeResponse =
    | "remove_success"
    | "remove_attribute_not_found"
    | "remove_identity_not_found";

export type RegisterAttributeResponse =
    | RegisterAttributeSuccess
    | RegisterAttributeAlreadyRegistered
    | RegisterAttributeInvalid;

export type RegisterAttributeSuccess = {
    kind: "register_attribute_success";
    id: bigint;
};

export type RegisterAttributeAlreadyRegistered = {
    kind: "register_attribute_already_registered";
};

export type RegisterAttributeInvalid = {
    kind: "register_attribute_invalid";
};

export type SendCodeResponse =
    | "success"
    | "already_sent"
    | "identity_not_found"
    | "attribute_not_found"
    | "already_verified"
    | "unsupported";

export type ConfirmCodeResponse =
    | "success"
    | "code_incorrect"
    | "code_invalid"
    | "code_expired"
    | "already_verified"
    | "not_sent"
    | "identity_not_found"
    | "attribute_not_found";

export type VisibleProfileAttributesResponse = "application_not_registered" | bigint[];

export type SetVisibleProfileAttributesResponse = "success";
