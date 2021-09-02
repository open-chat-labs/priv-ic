use candid::CandidType;
use serde::Deserialize;
use types::{FieldId, PhoneNumber};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    phone_number: PhoneNumber,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    AlreadyRegistered,
    AlreadyRegisteredByOther,
    InvalidPhoneNumber,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    field_id: FieldId,
}
