use candid::Principal;
use std::cell::RefCell;
use std::collections::HashSet;
use utils::env::Environment;

mod lifecycle;
mod model;
mod queries;
mod updates;

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
}

impl Data {
    pub fn new(verification_code_sender_principals: Vec<Principal>) -> Data {
        Data {
            verification_code_sender_principals: verification_code_sender_principals
                .into_iter()
                .collect(),
        }
    }
}
