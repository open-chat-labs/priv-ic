use crate::model::identity::{Attribute, Identity};
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::{HashMap, HashSet};
use types::{AttributeId, PhoneNumber, UserId};

#[derive(Default)]
pub struct IdentityMap {
    identities: HashMap<UserId, Identity>,
    registered_phone_numbers: HashSet<PhoneNumber>,
    registered_email_addresses: HashSet<String>,
}

impl IdentityMap {
    pub fn get(&self, user_id: &UserId) -> Option<&Identity> {
        self.identities.get(user_id)
    }

    pub fn get_mut(&mut self, user_id: &UserId) -> Option<&mut Identity> {
        self.identities.get_mut(user_id)
    }

    pub fn try_register_attribute(&mut self, user_id: UserId, attribute: Attribute) -> bool {
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

        let identity = match self.identities.entry(user_id) {
            Occupied(e) => e.into_mut(),
            Vacant(e) => e.insert(Identity::default()),
        };

        identity.add(attribute);
        true
    }

    pub fn remove_attribute(&mut self, user_id: &UserId, attribute_id: &AttributeId) -> bool {
        match self.identities.get_mut(user_id) {
            None => false,
            Some(identity) => match identity.get(attribute_id) {
                None => false,
                Some(attribute) => {
                    match attribute {
                        Attribute::PhoneNumber(va) => {
                            self.registered_phone_numbers.remove(&va.value);
                        }
                        Attribute::EmailAddress(va) => {
                            self.registered_email_addresses.remove(&va.value);
                        }
                    };
                    identity.remove(attribute_id);
                    true
                }
            },
        }
    }
}
