use std::collections::{hash_map, HashMap};
use types::{AttributeId, PhoneNumber, TimestampMillis};

pub const VERIFICATION_CODE_EXPIRY_MILLIS: u64 = 60 * 60 * 1000; // 1 hour

#[derive(Clone, Debug, Default)]
pub struct Identity {
    attributes: HashMap<AttributeId, Attribute>,
}

impl Identity {
    pub fn get_mut(&mut self, id: &AttributeId) -> Option<&mut Attribute> {
        self.attributes.get_mut(id)
    }
    
    pub fn values(&self) -> hash_map::Values<'_, AttributeId, Attribute> {
        self.attributes.values()
    }

    pub fn add(&mut self, attribute: Attribute) {
        self.attributes.insert(attribute.id(), attribute);
    }

    pub fn remove(&mut self, attribute_id: AttributeId) -> bool {
        match self.attributes.remove(&attribute_id) {
            None => false,
            Some(_) => true,
        }
    }
}

#[derive(Clone, Debug)]
pub enum Attribute {
    PhoneNumber(VerifiableAttribute<PhoneNumber>),
    EmailAddress(VerifiableAttribute<String>),
}

impl Attribute {
    pub fn id(&self) -> AttributeId {
        match self {
            Attribute::PhoneNumber(va) => va.id,
            Attribute::EmailAddress(va) => va.id,
        }
    }

    pub fn set_status(&mut self, status: VerificationCodeStatus) {
        match self {
            Attribute::PhoneNumber(va) => {
                va.status = status;
            }
            Attribute::EmailAddress(va) => {
                va.status = status;
            }
        }
    }

    pub fn status(&self) -> &VerificationCodeStatus {
        match self {
            Attribute::PhoneNumber(va) => &va.status,
            Attribute::EmailAddress(va) => &va.status,
        }
    }
}

#[derive(Clone, Debug)]
pub struct VerifiableAttribute<T: Clone> {
    pub id: AttributeId,
    pub status: VerificationCodeStatus,
    pub added: TimestampMillis,
    pub value: T,
}

#[derive(Clone, Debug)]
pub enum VerificationCodeStatus {
    Sent(VerificationCodeSentState),
    Verified(TimestampMillis),
}

#[derive(Clone, Debug)]
pub struct VerificationCodeSentState {
    pub code: String,
    pub date: TimestampMillis,
}
