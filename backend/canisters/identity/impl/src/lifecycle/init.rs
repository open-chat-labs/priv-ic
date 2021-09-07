use crate::{Data, RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::init;
use identity_canister_api::init::Args;
use utils::env::canister::CanisterEnv;

#[init]
fn init(args: Args) {
    ic_cdk::setup();

    RUNTIME_STATE.with(|state| {
        let env = Box::new(CanisterEnv::new(false));
        let data = Data::new(args.verification_code_sender_principals);
        let runtime_state = RuntimeState::new(env, data);

        *state.borrow_mut() = runtime_state;
    });
}
