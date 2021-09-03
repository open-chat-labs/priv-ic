use candid::CandidType;
use phonenumber::{Mode, PhoneNumber};
use serde::Deserialize;
use std::str::FromStr;

#[derive(CandidType, Clone, Deserialize, Debug)]
pub enum AttributeValue {
    Email(String),
    Phone(crate::PhoneNumber),
}

impl AttributeValue {
    pub fn try_normalise(&self) -> Option<AttributeValue> {
        match self {
            AttributeValue::Email(_address) => {
                // TODO: validate and normalize email address
                Some(self.clone())
            }
            AttributeValue::Phone(number) => {
                match PhoneNumber::from_str(&format!("+{} {}", number.country_code, number.number))
                {
                    Err(_) => None,
                    Ok(pn) => {
                        let normalised_phone_number = crate::PhoneNumber {
                            country_code: pn.code().value(),
                            number: pn.format().mode(Mode::National).to_string(),
                        };
                        Some(AttributeValue::Phone(normalised_phone_number))
                    }
                }
            }
        }
    }
}
