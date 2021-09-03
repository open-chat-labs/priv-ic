use crate::model::identity;
use crate::queries::profile::identity::VERIFICATION_CODE_EXPIRY_MILLIS;
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
    fn map_verifiable_field<T: CandidType + Clone>(
        field: &identity::VerifiableField<T>,
        now: TimestampMillis,
    ) -> VerifiableField<T> {
        VerifiableField::<T> {
            id: field.id,
            added: field.added,
            value: field.value.clone(),
            status: match &field.status {
                identity::VerificationCodeStatus::Pending => VerificationCodeStatus::Pending,
                identity::VerificationCodeStatus::Sent(s) => {
                    if s.date < now + VERIFICATION_CODE_EXPIRY_MILLIS {
                        VerificationCodeStatus::Sent(s.date)
                    } else {
                        VerificationCodeStatus::Expired(s.date + VERIFICATION_CODE_EXPIRY_MILLIS)
                    }
                }
                identity::VerificationCodeStatus::Verified(s) => {
                    VerificationCodeStatus::Verified(s.date)
                }
            },
        }
    }

    Identity {
        email: EmailFacet {
            addresses: identity
                .email_addresses
                .iter()
                .map(|e| map_verifiable_field(e, now))
                .collect(),
        },
        phone: PhoneFacet {
            numbers: identity
                .phone_numbers
                .iter()
                .map(|e| map_verifiable_field(e, now))
                .collect(),
        },
    }
}
