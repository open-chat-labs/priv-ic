use candid::CandidType;
use serde::{Deserialize, Serialize};

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
pub struct FieldId(u128);

impl From<u128> for FieldId {
    fn from(value: u128) -> FieldId {
        FieldId(value)
    }
}
