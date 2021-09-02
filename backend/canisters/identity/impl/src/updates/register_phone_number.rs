use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::register_phone_number::{Response::*, *};
// use phonenumber::PhoneNumber;
// use std::str::FromStr;

#[update]
fn register_phone_number(args: Args) -> Response {
    RUNTIME_STATE
        .with(|state| register_phone_number_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn register_phone_number_impl(_args: Args, runtime_state: &mut RuntimeState) -> Response {
    let _caller = runtime_state.env.caller();
    let _now = runtime_state.env.now();
    InvalidPhoneNumber
}
