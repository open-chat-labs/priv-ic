use crate::model::identity;
use crate::model::identity::Attribute::{EmailAddress, PhoneNumber};
use crate::model::identity::VERIFICATION_CODE_EXPIRY_MILLIS;
use crate::{RuntimeState, RUNTIME_STATE};
use candid::CandidType;
use ic_cdk_macros::query;
use identity_canister_api::profile::{Response::*, *};
use types::{Application, TimestampMillis};

#[query]
fn profile(_args: Args) -> Response {
    RUNTIME_STATE.with(|state| profile_impl(state.borrow().as_ref().unwrap()))
}

fn profile_impl(runtime_state: &RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    match runtime_state.data.identities.get(&user_id) {
        None => NotFound,
        Some(internal_identity) => {
            let identity = map_identity(internal_identity, runtime_state.env.now());
            let user_id = runtime_state.env.caller().into();
            let apps = runtime_state
                .data
                .applications
                .domains(user_id)
                .iter()
                .map(|domain_name| Application {
                    domain_name: domain_name.clone(),
                })
                .collect();
            Success(SuccessResult { identity, apps })
        }
    }
}

fn map_identity(identity: &identity::Identity, now: TimestampMillis) -> Identity {
    fn map_verifiable_attribute<T: CandidType + Clone>(
        attribute: &identity::VerifiableAttribute<T>,
        now: TimestampMillis,
    ) -> VerifiableAttribute<T> {
        VerifiableAttribute::<T> {
            id: attribute.id,
            added: attribute.added,
            value: attribute.value.clone(),
            status: match &attribute.status {
                identity::VerificationCodeStatus::Sent(s) => {
                    if s.date < now + VERIFICATION_CODE_EXPIRY_MILLIS {
                        VerificationCodeStatus::Sent(s.date)
                    } else {
                        VerificationCodeStatus::Expired(s.date + VERIFICATION_CODE_EXPIRY_MILLIS)
                    }
                }
                identity::VerificationCodeStatus::Verified(s) => {
                    VerificationCodeStatus::Verified(*s)
                }
            },
        }
    }

    let mut email_addresses = vec![];
    let mut phone_numbers = vec![];

    for a in identity.values() {
        match a {
            EmailAddress(va) => {
                email_addresses.push(map_verifiable_attribute(va, now));
            }
            PhoneNumber(va) => {
                phone_numbers.push(map_verifiable_attribute(va, now));
            }
        }
    }

    Identity {
        email: EmailFacet {
            addresses: email_addresses,
        },
        phone: PhoneFacet {
            numbers: phone_numbers,
        },
    }
}
