use crate::model::identity::{
    Attribute, VerifiableAttribute, VerificationCodeSentState, VerificationCodeStatus,
};
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::register_attribute::{Response::*, *};
use types::{AttributeId, AttributeValue};

#[update]
fn register_attribute(args: Args) -> Response {
    RUNTIME_STATE.with(|state| register_attribute_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn register_attribute_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let now = runtime_state.env.now();

    let value = match args.value.try_normalise() {
        None => return InvalidValue,
        Some(v) => v,
    };

    let attribute_id = AttributeId::new();
    let code = format!("{:0>6}", runtime_state.env.random_u32());
    let status = VerificationCodeStatus::Sent(VerificationCodeSentState { code, date: now });

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

    match runtime_state
        .data
        .identities
        .try_register_attribute(caller, attribute)
    {
        false => AlreadyRegistered,
        true => Success(SuccessResult { attribute_id }),
    }
}
