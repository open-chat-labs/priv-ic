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

impl dyn Environment {
    pub fn rand_u128(&mut self) -> u128 {
        let mut val = 0_u128;
        for i in 0..4 {
            let b = self.random_u32() as u128;
            val |= b;
            if i < 3 {
                val <<= 32;
            }
        }
        val
    }

    pub fn new_verification_code(&mut self) -> String {
        format!("{:0>4}", self.random_u32() % 10000)

    }
}

pub struct EmptyEnvironment {}

impl Environment for EmptyEnvironment {
    fn now(&self) -> u64 {
        unimplemented!()
    }

    fn caller(&self) -> Principal {
        unimplemented!()
    }

    fn canister_id(&self) -> CanisterId {
        unimplemented!()
    }

    fn random_u32(&mut self) -> u32 {
        unimplemented!()
    }

    fn test_mode(&self) -> bool {
        unimplemented!()
    }
}
