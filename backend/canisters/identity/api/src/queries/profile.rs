use candid::CandidType;
use serde::Deserialize;
use types::{App, AttributeId, PhoneNumber, TimestampMillis};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    NotFound,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub identity: Identity,
    pub apps: Vec<App>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct Identity {
    pub email: EmailFacet,
    pub phone: PhoneFacet,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct EmailFacet {
    pub addresses: Vec<VerifiableAttribute<String>>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct PhoneFacet {
    pub numbers: Vec<VerifiableAttribute<PhoneNumber>>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerifiableAttribute<T: CandidType + Clone> {
    pub id: AttributeId,
    pub status: VerificationCodeStatus,
    pub added: TimestampMillis,
    pub value: T,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum VerificationCodeStatus {
    Sent(TimestampMillis),
    Expired(TimestampMillis),
    Verified(TimestampMillis),
}
