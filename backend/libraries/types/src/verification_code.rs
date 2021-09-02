use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Deserialize, Debug)]
pub struct VerificationCode {
    pub index: u64,
    pub code: String,
    pub target: VerificationCodeTarget,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum VerificationCodeTarget {
    Phone(String),
    Email(String),
    // Address(PostalAddress),
}
