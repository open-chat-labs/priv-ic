use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::remove_attribute::{Response::*, *};

#[update]
fn remove_attribute(args: Args) -> Response {
    RUNTIME_STATE.with(|state| remove_attribute_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn remove_attribute_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    let identity = match runtime_state.data.identities.get_mut(&user_id) {
        None => return IdentityNotFound,
        Some(i) => i,
    };

    match identity.remove(args.attribute_id) {
        true => Success,
        false => AttributeNotFound,
    }
}