use candid::CandidType;
use serde::Deserialize;
use types::{IndexedEvent, VerificationCode};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub from_index: u64,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    NotAuthorized,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub verification_codes: Vec<IndexedEvent<VerificationCode>>,
}
