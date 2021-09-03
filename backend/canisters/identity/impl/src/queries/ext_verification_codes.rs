use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::query;
use identity_canister_api::ext_verification_codes::{Response::*, *};

const MAX_VERIFICATION_CODES_PER_BATCH: u32 = 100;

#[query]
fn ext_verification_codes(args: Args) -> Response {
    RUNTIME_STATE.with(|state| ext_verification_codes_impl(args, state.borrow().as_ref().unwrap()))
}

fn ext_verification_codes_impl(args: Args, runtime_state: &RuntimeState) -> Response {
    if !runtime_state.is_caller_verification_code_sender() {
        return NotAuthorized;
    }

    let verification_codes = runtime_state
        .data
        .verifications_to_send
        .get(args.from_index, MAX_VERIFICATION_CODES_PER_BATCH);

    Success(SuccessResult { verification_codes })
}
