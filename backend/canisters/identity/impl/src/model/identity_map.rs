use crate::model::identity::Identity;
use crate::model::identity::{VerifiableAttribute, VerificationCodeStatus};
use candid::Principal;
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::HashMap;
use std::collections::HashSet;
use types::{AttributeId, PhoneNumber, TimestampMillis};

#[derive(Default)]
pub struct IdentityMap {
    identities_by_principal: HashMap<Principal, Identity>,
    registered_phone_numbers: HashSet<PhoneNumber>,
    // email_address_to_principal: HashMap<String, Principal>,
    // principal_by_app_principal: HashMap<Principal, Principal>,
}

impl IdentityMap {
    pub fn get_by_principal(&self, principal: &Principal) -> Option<&Identity> {
        self.identities_by_principal.get(principal)
    }

    pub fn try_register_phone_number(
        &mut self,
        principal: Principal,
        phone_number: PhoneNumber,
        now: TimestampMillis,
    ) -> Option<AttributeId> {
        if self.registered_phone_numbers.contains(&phone_number) {
            return None;
        }

        let identity = match self.identities_by_principal.entry(principal) {
            Occupied(e) => e.into_mut(),
            Vacant(e) => e.insert(Identity::default()),
        };

        let id = AttributeId::new();
        let attribute = VerifiableAttribute::<PhoneNumber> {
            id,
            status: VerificationCodeStatus::Pending,
            added: now,
            value: phone_number.clone(),
        };

        identity.phone_numbers.push(attribute);
        self.registered_phone_numbers.insert(phone_number);

        Some(id)
    }
}
