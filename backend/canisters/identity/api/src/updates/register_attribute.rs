use candid::CandidType;
use serde::Deserialize;
use types::{AttributeId, AttributeValue};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub value: AttributeValue,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    AlreadyRegistered,
    InvalidValue,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub attribute_id: AttributeId,
}
