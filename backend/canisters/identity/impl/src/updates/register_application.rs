use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::register_application::{Response::*, *};

#[update]
fn register_application(args: Args) -> Response {
    RUNTIME_STATE.with(|state| register_application_impl(args, &mut state.borrow_mut()))
}

fn register_application_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    match runtime_state
        .data
        .applications
        .register(user_id, args.app_domain_name)
    {
        Some(_) => Success,
        None => AlreadyRegistered,
    }
}
