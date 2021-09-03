use candid::CandidType;
use serde::Deserialize;
use types::{App, FieldId, PhoneNumber, TimestampMillis};

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
    pub addresses: Vec<VerifiableField<String>>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct PhoneFacet {
    pub numbers: Vec<VerifiableField<PhoneNumber>>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerifiableField<T: CandidType + Clone> {
    pub id: FieldId,
    pub status: VerificationCodeStatus,
    pub added: TimestampMillis,
    pub value: T,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum VerificationCodeStatus {
    Pending,
    Sent(TimestampMillis),
    Expired(TimestampMillis),
    Verified(TimestampMillis),
}
