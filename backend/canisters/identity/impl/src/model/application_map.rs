use candid::Principal;
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::{HashMap, HashSet};
use types::{ApplicationId, AttributeId, UserId};

#[derive(Default)]
pub struct ApplicationMap {
    app_domains_by_user: HashMap<UserId, HashSet<String>>,
    app_to_user: HashMap<ApplicationId, UserId>,
    app_attributes: HashMap<ApplicationId, Vec<AttributeId>>,
}

impl ApplicationMap {
    pub fn register(&mut self, user_id: UserId, domain_name: String) -> bool {
        let application_id = self.derive_application_id(&user_id, &domain_name);
        // Insert a user if it doesn't exist or get current set of application domains
        let applications = match self.app_domains_by_user.entry(user_id) {
            Occupied(e) => e.into_mut(),
            Vacant(e) => e.insert(HashSet::default()),
        };

        // Insert the application and return false if it is already registered
        if !applications.insert(domain_name) {
            return false;
        }

        self.app_to_user.insert(application_id, user_id).is_none()
    }

    pub fn set_attributes(
        &mut self,
        user_id: UserId,
        domain_name: String,
        attributes: Vec<AttributeId>,
    ) -> bool {
        let application_id = self.derive_application_id(&user_id, &domain_name);
        let registered = self.app_to_user.contains_key(&application_id);
        if registered {
            self.app_attributes.insert(application_id, attributes);
        }
        registered
    }

    pub fn domains(&self, user_id: UserId) -> Vec<String> {
        match self.app_domains_by_user.get(&user_id) {
            None => Vec::default(),
            Some(apps) => apps.iter().cloned().collect(),
        }
    }

    pub fn attributes(&self, user_id: UserId, domain_name: String) -> Option<Vec<AttributeId>> {
        let application_id = self.derive_application_id(&user_id, &domain_name);
        let registered = self.app_to_user.contains_key(&application_id);
        if !registered {
            return None;
        }

        let attributes = match self.app_attributes.get(&application_id) {
            None => Vec::default(),
            Some(attrs) => attrs.to_vec(),
        };

        Some(attributes)
    }

    fn derive_application_id(&self, _user_id: &UserId, _domain_name: &str) -> ApplicationId {
        Principal::anonymous().into()
    }
}
