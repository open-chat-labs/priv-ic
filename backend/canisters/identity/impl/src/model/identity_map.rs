use crate::model::identity::Attribute;
use crate::model::identity::Identity;
use candid::Principal;
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::HashMap;
use std::collections::HashSet;
use types::PhoneNumber;

#[derive(Default)]
pub struct IdentityMap {
    identities_by_principal: HashMap<Principal, Identity>,
    registered_phone_numbers: HashSet<PhoneNumber>,
    registered_email_addresses: HashSet<String>,
    // principal_by_app_principal: HashMap<Principal, Principal>,
}

impl IdentityMap {
    pub fn get_by_principal(&self, principal: &Principal) -> Option<&Identity> {
        self.identities_by_principal.get(principal)
    }

    pub fn get_by_principal_mut(&mut self, principal: &Principal) -> Option<&mut Identity> {
        self.identities_by_principal.get_mut(principal)
    }

    pub fn try_register_attribute(&mut self, principal: Principal, attribute: Attribute) -> bool {
        match &attribute {
            Attribute::PhoneNumber(va) => {
                if !self.registered_phone_numbers.insert(va.value.clone()) {
                    return false;
                }
            }
            Attribute::EmailAddress(va) => {
                if !self.registered_email_addresses.insert(va.value.clone()) {
                    return false;
                }
            }
        };

        let identity = match self.identities_by_principal.entry(principal) {
            Occupied(e) => e.into_mut(),
            Vacant(e) => e.insert(Identity::default()),
        };

        identity.add(attribute);
        true
    }
}
