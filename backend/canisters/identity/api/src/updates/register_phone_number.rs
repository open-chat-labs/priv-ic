use candid::CandidType;
use serde::Deserialize;
use types::{FieldId, PhoneNumber};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub phone_number: PhoneNumber,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    AlreadyRegistered,
    InvalidPhoneNumber,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub field_id: FieldId,
}
