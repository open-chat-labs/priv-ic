use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::query;
use identity_canister_api::visible_attributes::{Response::*, *};

#[query]
fn visible_attributes(args: Args) -> Response {
    RUNTIME_STATE.with(|state| visible_attributes_impl(args, state.borrow().as_ref().unwrap()))
}

fn visible_attributes_impl(args: Args, runtime_state: &RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    match runtime_state
        .data
        .applications
        .attributes(user_id, args.app_domain_name)
    {
        None => ApplicationNotRegistered,
        Some(attributes) => Success(SuccessResult { attributes }),
    }
}
