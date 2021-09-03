use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Clone, Deserialize, Debug, Eq, Hash, PartialEq)]
pub struct PhoneNumber {
    pub country_code: u16,
    pub number: String,
}
