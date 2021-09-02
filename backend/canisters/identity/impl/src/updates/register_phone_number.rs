use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::register_phone_number::{Response::*, *};
use phonenumber::{Mode, PhoneNumber};
use std::str::FromStr;

#[update]
fn register_phone_number(args: Args) -> Response {
    RUNTIME_STATE
        .with(|state| register_phone_number_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn register_phone_number_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let now = runtime_state.env.now();
    match PhoneNumber::from_str(&format!(
        "+{} {}",
        args.phone_number.country_code, args.phone_number.number
    )) {
        Err(_) => InvalidPhoneNumber,
        Ok(phone_number) => {
            let normalised_phone_number = types::PhoneNumber {
                country_code: phone_number.code().value(),
                number: phone_number.format().mode(Mode::National).to_string(),
            };

            match runtime_state.data.identities.try_register_phone_number(
                caller,
                normalised_phone_number,
                now,
            ) {
                None => AlreadyRegistered,
                Some(field_id) => Success(SuccessResult { field_id }),
            }
        }
    }
}
