use candid::Principal;
use types::{CanisterId, TimestampMillis};

pub mod canister;
pub mod test;

pub trait Environment {
    fn now(&self) -> TimestampMillis;
    fn caller(&self) -> Principal;
    fn canister_id(&self) -> CanisterId;
    fn random_u32(&mut self) -> u32;
    fn test_mode(&self) -> bool;
}

pub struct EmptyEnvironment {}

impl Environment for EmptyEnvironment {
    fn now(&self) -> u64 {
        todo!()
    }

    fn caller(&self) -> Principal {
        todo!()
    }

    fn canister_id(&self) -> CanisterId {
        todo!()
    }

    fn random_u32(&mut self) -> u32 {
        todo!()
    }

    fn test_mode(&self) -> bool {
        todo!()
    }
}
