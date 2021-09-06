use crate::model::identity::{VerificationCodeStatus, VERIFICATION_CODE_EXPIRY_MILLIS};
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::confirm_verification_code::{Response::*, *};

#[update]
fn confirm_verification_code(args: Args) -> Response {
    RUNTIME_STATE
        .with(|state| confirm_verification_code_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn confirm_verification_code_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let now = runtime_state.env.now();

    if args.verification_code.len() > 8 {
        return VerificationCodeInvalid;
    }

    let user_id = runtime_state.env.caller().into();
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
            if state.date > now + VERIFICATION_CODE_EXPIRY_MILLIS {
                return VerificationCodeExpired;
            } else if state.code != args.verification_code {
                return VerificationCodeIncorrect;
            }
        }
        VerificationCodeStatus::Verified(_) => return AlreadyVerified,
    }

    attribute.set_status(VerificationCodeStatus::Verified(now));
    Success
}
