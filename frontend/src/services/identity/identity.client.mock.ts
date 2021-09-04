import {
    nullProfile,
    PhoneNumber,
    addPhoneNumber,
    Profile,
    RegisterAttributeResponse,
    SendCodeResponse,
    ConfirmCodeResponse,
    addEmailAddress,
    VisibleProfileAttributesResponse,
} from "../../domain/identity/identity";
import type { IIdentityClient } from "./identity.client.interface";
import { v1 as uuidv1 } from "uuid";

const distrikt = "https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/";
const openchat = "https://7e6iv-biaaa-aaaaf-aaada-cai.ic0.app/";
const dscvr = "https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/";

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

    registerEmailAddress(_address: string): Promise<RegisterAttributeResponse> {
        console.log("Registering phone number");
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_attribute_success",
                    id: newFieldId(),
                });
            }, 1000);
        });
    }

    registerPhoneNumber(_phoneNumber: PhoneNumber): Promise<RegisterAttributeResponse> {
        console.log("Registering phone number");
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    kind: "register_attribute_success",
                    id: newFieldId(),
                });
            }, 1000);
        });
    }

    visibleProfileAttributes(domainName: string): Promise<VisibleProfileAttributesResponse> {
        return new Promise((res) => {
            setTimeout(() => {
                res(domainName === openchat ? [BigInt(100), BigInt(200)] : []);
            }, 1000);
        });
    }

    getProfile(): Promise<Profile> {
        console.log("Getting mock profile");
        return new Promise((res) => {
            let prof = addPhoneNumber(
                {
                    ...nullProfile,
                    apps: [
                        { domainName: distrikt },
                        { domainName: openchat },
                        { domainName: dscvr },
                    ],
                },
                {
                    id: BigInt(100),
                    status: "pending",
                    added: BigInt(+new Date()),
                    value: {
                        countryCode: 44,
                        number: "07867538921",
                    },
                }
            );
            prof = addEmailAddress(prof, {
                id: BigInt(200),
                status: "verified",
                added: BigInt(+new Date()),
                value: "julian.jelfs@gmail.com",
            });
            setTimeout(() => {
                res(prof);
            }, 1000);
        });
    }
}
