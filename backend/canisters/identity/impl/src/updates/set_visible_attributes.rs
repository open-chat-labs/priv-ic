use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::set_visible_attributes::{Response::*, *};

#[update]
fn set_visible_attributes(args: Args) -> Response {
    RUNTIME_STATE.with(|state| set_visible_attributes_impl(args, &mut state.borrow_mut()))
}

fn set_visible_attributes_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    match runtime_state.data.applications.set_attributes(
        user_id,
        args.app_domain_name,
        args.attributes,
    ) {
        false => ApplicationNotRegistered,
        true => Success,
    }
}
