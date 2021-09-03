use types::{FieldId, PhoneNumber, TimestampMillis};

pub const VERIFICATION_CODE_EXPIRY_MILLIS: u64 = 60 * 60 * 1000; // 1 hour

#[derive(Clone, Debug, Default)]
pub struct Identity {
    pub email_addresses: Vec<VerifiableField<String>>,
    pub phone_numbers: Vec<VerifiableField<PhoneNumber>>,
}

#[derive(Clone, Debug)]
pub struct VerifiableField<T: Clone> {
    pub id: FieldId,
    pub status: VerificationCodeStatus,
    pub added: TimestampMillis,
    pub value: T,
}

#[derive(Clone, Debug)]
pub enum VerificationCodeStatus {
    Pending,
    Sent(VerificationCodeSentState),
    Verified(VerificationCodeVerifiedState),
}

#[derive(Clone, Debug)]
pub struct VerificationCodeSentState {
    pub code: String,
    pub date: TimestampMillis,
}

#[derive(Clone, Debug)]
pub struct VerificationCodeVerifiedState {
    pub date: TimestampMillis,
}
