use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct PhoneNumber {
    pub country_code: u16,
    pub number: String,
}
