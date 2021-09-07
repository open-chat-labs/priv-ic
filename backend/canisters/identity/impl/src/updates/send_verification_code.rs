use crate::model::identity::VERIFICATION_CODE_EXPIRY_MILLIS;
use crate::model::identity::{VerificationCodeSentState, VerificationCodeStatus};
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::send_verification_code::{Response::*, *};
use types::VerificationCode;

#[update]
fn send_verification_code(args: Args) -> Response {
    RUNTIME_STATE.with(|state| send_verification_code_impl(args, &mut state.borrow_mut()))
}

fn send_verification_code_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let user_id = runtime_state.env.caller().into();
    let now = runtime_state.env.now();
    let verification_code = runtime_state.new_verification_code();

    let identity = match runtime_state.data.identities.get_mut(&user_id) {
        None => return IdentityNotFound,
        Some(i) => i,
    };

    let attribute = match identity.get_mut(&args.attribute_id) {
        None => return AttributeNotFound,
        Some(a) => a,
    };

    match attribute.status() {
        VerificationCodeStatus::Sent(state) => {
            if state.date < now + VERIFICATION_CODE_EXPIRY_MILLIS {
                return AlreadySent;
            }
        }
        VerificationCodeStatus::Verified(_) => return AlreadyVerified,
    };

    let status = VerificationCodeStatus::Sent(VerificationCodeSentState {
        code: verification_code.clone(),
        date: now,
    });

    attribute.set_status(status);

    runtime_state
        .data
        .verifications_to_send
        .add(VerificationCode {
            code: verification_code,
            target: attribute.target(),
        });

    Success
}
