use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::query;
use identity_canister_api::profile::{Response::*, *};

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
            identity: identity.clone(),
            apps: vec![],
        }),
    }
}
