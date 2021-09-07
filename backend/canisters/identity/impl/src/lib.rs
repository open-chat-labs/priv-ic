use crate::model::application_map::ApplicationMap;
use crate::model::identity_map::IdentityMap;
use candid::Principal;
use std::cell::RefCell;
use std::collections::HashSet;
use types::VerificationCode;
use utils::env::{EmptyEnvironment, Environment};
use utils::event_stream::EventStream;

mod lifecycle;
mod model;
mod queries;
mod updates;

#[allow(clippy::all)]
mod internet_identity;

pub const CONFIRMATION_CODE_EXPIRY_MILLIS: u64 = 60 * 60 * 1000; // 1 hour

thread_local! {
    pub static RUNTIME_STATE: RefCell<RuntimeState> = RefCell::default();
}

pub struct RuntimeState {
    pub env: Box<dyn Environment>,
    pub data: Data,
}

impl RuntimeState {
    pub fn new(env: Box<dyn Environment>, data: Data) -> RuntimeState {
        RuntimeState { env, data }
    }

    pub fn is_caller_verification_code_sender(&self) -> bool {
        self.data
            .verification_code_sender_principals
            .contains(&self.env.caller())
    }
}

impl Default for RuntimeState {
    fn default() -> Self {
        RuntimeState {
            env: Box::new(EmptyEnvironment {}),
            data: Data::default(),
        }
    }
}

#[derive(Default)]
pub struct Data {
    pub verification_code_sender_principals: HashSet<Principal>,
    pub identities: IdentityMap,
    pub applications: ApplicationMap,
    pub verifications_to_send: EventStream<VerificationCode>,
}

impl Data {
    pub fn new(verification_code_sender_principals: Vec<Principal>) -> Data {
        Data {
            verification_code_sender_principals: verification_code_sender_principals
                .into_iter()
                .collect(),
            identities: IdentityMap::default(),
            applications: ApplicationMap::default(),
            verifications_to_send: EventStream::default(),
        }
    }
}

#[cfg(test)]
mod tests {
    use utils::env::test::TestEnv;

    #[test]
    fn test_rand_u128() {
        let env = TestEnv::default();
        let value = env.rand_u128();
        println!("u128: {}", value);
        assert!(value > 0);
    }
}
