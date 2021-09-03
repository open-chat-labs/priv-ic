use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct VerificationCode {
    pub code: String,
    pub target: VerificationCodeTarget,
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub enum VerificationCodeTarget {
    Phone(String),
    Email(String),
    // Address(PostalAddress),
}
