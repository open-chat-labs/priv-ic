use crate::model::identity_map::IdentityMap;
use candid::Principal;
use std::cell::RefCell;
use std::collections::HashSet;
use utils::env::Environment;

mod lifecycle;
mod model;
mod queries;
mod updates;

pub const CONFIRMATION_CODE_EXPIRY_MILLIS: u64 = 60 * 60 * 1000; // 1 hour

thread_local! {
    pub static RUNTIME_STATE: RefCell<Option<RuntimeState>> = RefCell::default();
}

pub struct RuntimeState {
    pub env: Box<dyn Environment>,
    pub data: Data,
}

impl RuntimeState {
    pub fn new(env: Box<dyn Environment>, data: Data) -> RuntimeState {
        RuntimeState { env, data }
    }
}

pub struct Data {
    pub verification_code_sender_principals: HashSet<Principal>,
    pub identities: IdentityMap,
}

impl Data {
    pub fn new(verification_code_sender_principals: Vec<Principal>) -> Data {
        Data {
            verification_code_sender_principals: verification_code_sender_principals
                .into_iter()
                .collect(),
            identities: IdentityMap::default(),
        }
    }
}
