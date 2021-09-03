import {
    nullProfile,
    PhoneNumber,
    addPhoneNumber,
    Profile,
    RegisterPhoneResponse,
    SendCodeResponse,
    ConfirmCodeResponse,
    RegisterEmailResponse,
} from "../../domain/identity/identity";
import type { IIdentityClient } from "./identity.client.interface";
import { v1 as uuidv1 } from "uuid";

export function newFieldId(): bigint {
    return BigInt(parseInt(uuidv1().replace(/-/g, ""), 16));
}

export class IdentityClientMock implements IIdentityClient {
    confirmVerificationCode(_id: bigint, _code: string): Promise<ConfirmCodeResponse> {
        return new Promise((res) => {
            setTimeout(() => {
                res("success");
            }, 1000);
        });
    }

    sendVerificationCode(_id: bigint): Promise<SendCodeResponse> {
        return new Promise((res) => {
            setTimeout(() => {
                res("success");
            }, 1000);
        });
    }

    registerEmailAddress(_address: string): Promise<RegisterEmailResponse> {
        console.log("Registering phone number");
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_email_success",
                    id: newFieldId(),
                });
            }, 1000);
        });
    }

    registerPhoneNumber(_phoneNumber: PhoneNumber): Promise<RegisterPhoneResponse> {
        console.log("Registering phone number");
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_phone_success",
                    id: newFieldId(),
                });
            }, 1000);
        });
    }

    getProfile(): Promise<Profile> {
        console.log("Getting mock profile");
        return new Promise((res) => {
            const prof = addPhoneNumber(
                {
                    ...nullProfile,
                    apps: [
                        { domainName: "https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/" }, // distrikt
                        { domainName: "https://7e6iv-biaaa-aaaaf-aaada-cai.ic0.app/" }, // openchat
                        { domainName: "https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/" }, //dscvr
                    ],
                },
                {
                    id: newFieldId(),
                    status: "pending",
                    added: BigInt(+new Date()),
                    value: {
                        countryCode: 44,
                        number: "07867538921",
                    },
                }
            );
            setTimeout(() => {
                res(prof);
            }, 1000);
        });
    }
}
