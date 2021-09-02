use crate::FieldId;
use crate::PhoneNumber;
use crate::TimestampMillis;
use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Identity {
    pub email: EmailFacet,
    pub phone: PhoneFacet,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerifiableField<T: CandidType + Clone> {
    pub id: FieldId,
    pub status: VerificationCodeStatus,
    pub added: TimestampMillis,
    pub value: T,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct EmailFacet {
    pub addresses: Vec<VerifiableField<String>>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct PhoneFacet {
    pub numbers: Vec<VerifiableField<PhoneNumber>>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum VerificationCodeStatus {
    Pending,
    Sent(VerificationCodeSentState),
    Verified(VerificationCodeVerifiedState),
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerificationCodeSentState {
    code: String,
    date: TimestampMillis,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerificationCodeVerifiedState {
    date: TimestampMillis,
}
