use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::remove_attribute::{Response::*, *};

#[update]
fn remove_attribute(args: Args) -> Response {
    RUNTIME_STATE.with(|state| remove_attribute_impl(args, &mut state.borrow_mut()))
}

fn remove_attribute_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();

    // Remove the attribute from any of the apps the user has registered
    runtime_state
        .data
        .applications
        .remove_attribute(&user_id, &args.attribute_id);

    // Remove the attribute from the user's identity
    let identity = match runtime_state.data.identities.get_mut(&user_id) {
        None => return IdentityNotFound,
        Some(i) => i,
    };

    match identity.remove(&args.attribute_id) {
        true => Success,
        false => AttributeNotFound,
    }
}
