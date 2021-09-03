use crate::model::identity;
use crate::model::identity::Attribute::{EmailAddress, PhoneNumber};
use crate::model::identity::VERIFICATION_CODE_EXPIRY_MILLIS;
use crate::{RuntimeState, RUNTIME_STATE};
use candid::CandidType;
use ic_cdk_macros::query;
use identity_canister_api::profile::{Response::*, *};
use types::TimestampMillis;

#[query]
fn chunk(_args: Args) -> Response {
    RUNTIME_STATE.with(|state| chunk_impl(state.borrow().as_ref().unwrap()))
}

fn chunk_impl(runtime_state: &RuntimeState) -> Response {
    match runtime_state
        .data
        .identities
        .get_by_principal(&runtime_state.env.caller())
    {
        None => NotFound,
        Some(identity) => Success(SuccessResult {
            identity: map_identity(identity, runtime_state.env.now()),
            apps: vec![],
        }),
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
