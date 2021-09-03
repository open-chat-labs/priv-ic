use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::ext_remove_verification_codes::{Response::*, *};

#[update]
fn ext_remove_verification_codes(args: Args) -> Response {
    RUNTIME_STATE.with(|state| {
        ext_remove_verification_codes_impl(args, state.borrow_mut().as_mut().unwrap())
    })
}

fn ext_remove_verification_codes_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    if runtime_state.is_caller_verification_code_sender() {
        runtime_state
            .data
            .verifications_to_send
            .remove(args.up_to_index);
        
        Success
    } else {
        NotAuthorized
    }
}
