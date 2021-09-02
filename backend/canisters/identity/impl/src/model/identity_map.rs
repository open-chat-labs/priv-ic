use candid::Principal;
// use phonenumber::PhoneNumber;
// use std::collections::hash_map;
// use std::collections::hash_map::Entry::Vacant;
use std::collections::HashMap;
use types::Identity;
// use types::TimestampMillis;

#[derive(Default)]
pub struct IdentityMap {
    identities_by_principal: HashMap<Principal, Identity>,
    // phone_number_to_principal: HashMap<PhoneNumber, Principal>,
    // email_address_to_principal: HashMap<String, Principal>,
    // principal_by_app_principal: HashMap<Principal, Principal>,
}

impl IdentityMap {
    pub fn get_by_principal(&self, principal: &Principal) -> Option<&Identity> {
        self.identities_by_principal.get(principal)
    }
}
