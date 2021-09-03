use crate::model::identity::{Attribute, VerificationCodeSentState, VerificationCodeStatus};
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::update;
use identity_canister_api::send_verification_code::{Response::*, *};
use types::{VerificationCode, VerificationCodeTarget};

#[update]
fn send_verification_code(args: Args) -> Response {
    RUNTIME_STATE
        .with(|state| send_verification_code_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn send_verification_code_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let now = runtime_state.env.now();

    let identity = match runtime_state.data.identities.get_by_principal_mut(&caller) {
        None => return IdentityNotFound,
        Some(i) => i,
    };

    let attribute = match identity.get_mut(&args.attribute_id) {
        None => return AttributeNotFound,
        Some(a) => a,
    };

    match attribute.status() {
        VerificationCodeStatus::Sent(_) => return AlreadySent,
        VerificationCodeStatus::Verified(_) => return AlreadyVerified,
        VerificationCodeStatus::Pending => (),
    };

    let code = format!("{:0>6}", runtime_state.env.random_u32());
    let status = VerificationCodeStatus::Sent(VerificationCodeSentState {
        code: code.clone(),
        date: now,
    });

    attribute.set_status(status);

    // Add the verfication code to a queue which will be processed by the verification_code_sender
    let target = match &attribute {
        Attribute::PhoneNumber(va) => {
            let number = format!("{} {}", va.value.country_code, va.value.number);
            VerificationCodeTarget::Phone(number)
        }
        Attribute::EmailAddress(va) => VerificationCodeTarget::Phone(va.value.clone()),
    };
    runtime_state
        .data
        .verifications_to_send
        .add(VerificationCode { code, target });

    Success
}
