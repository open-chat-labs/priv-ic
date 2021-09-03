use crate::PhoneNumber;
use crate::VerifiableField;
use candid::CandidType;
use serde::Deserialize;

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
