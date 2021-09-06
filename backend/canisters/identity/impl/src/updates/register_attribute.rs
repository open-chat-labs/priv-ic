use crate::model::identity::{
    Attribute, VerifiableAttribute, VerificationCodeSentState, VerificationCodeStatus,
};
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::register_attribute::{Response::*, *};
use types::{AttributeValue, VerificationCode};

#[update]
fn register_attribute(args: Args) -> Response {
    RUNTIME_STATE.with(|state| register_attribute_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn register_attribute_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    let now = runtime_state.env.now();

    let value = match args.value.try_normalise() {
        None => return InvalidValue,
        Some(v) => v,
    };

    let verification_code = runtime_state.new_verification_code();
    let attribute_id = runtime_state.rand_u128().into();
    let sent_state = VerificationCodeSentState {
        code: verification_code.clone(),
        date: now,
    };
    let status = VerificationCodeStatus::Sent(sent_state);

    let attribute = match value {
        AttributeValue::Email(address) => Attribute::EmailAddress(VerifiableAttribute::<String> {
            id: attribute_id,
            status,
            added: now,
            value: address,
        }),
        AttributeValue::Phone(number) => {
            Attribute::PhoneNumber(VerifiableAttribute::<types::PhoneNumber> {
                id: attribute_id,
                status,
                added: now,
                value: number,
            })
        }
    };

    let verification_target = attribute.target();

    if !runtime_state
        .data
        .identities
        .try_register_attribute(user_id, attribute)
    {
        return AlreadyRegistered;
    }

    runtime_state
        .data
        .verifications_to_send
        .add(VerificationCode {
            code: verification_code,
            target: verification_target,
        });

    Success(SuccessResult { attribute_id })
}
