use candid::CandidType;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(
    CandidType,
    Serialize,
    Deserialize,
    Debug,
    Default,
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Hash,
)]
pub struct AttributeId(u128);

impl From<u128> for AttributeId {
    fn from(value: u128) -> AttributeId {
        AttributeId(value)
    }
}

impl AttributeId {
    pub fn new() -> AttributeId {
        AttributeId(Uuid::new_v4().as_u128())
    }
}
