use candid::CandidType;
use serde::Deserialize;
use types::AttributeId;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub attribute_id: AttributeId,
    pub verification_code: String,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success,
    VerificationCodeInvalid,
    VerificationCodeIncorrect,
    VerificationCodeExpired,
    AlreadyVerified,
    AttributeNotFound,
    IdentityNotFound,
}
