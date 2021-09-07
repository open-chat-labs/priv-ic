use candid::Principal;
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::{HashMap, HashSet};
use types::{AppUserId, AttributeId, UserId};

#[derive(Default)]
pub struct ApplicationMap {
    apps_by_user: HashMap<UserId, HashMap<String, AppUserId>>,
    app_user_to_user: HashMap<AppUserId, UserId>,
    app_attributes: HashMap<AppUserId, HashSet<AttributeId>>,
}

impl ApplicationMap {
    pub fn user_id(&self, app_user_id: &AppUserId) -> Option<&UserId> {
        self.app_user_to_user.get(app_user_id)
    }

    pub fn register(&mut self, user_id: UserId, domain_name: String) -> bool {
        let app_user_id = self.derive_app_user_id(&user_id, &domain_name);
        // Insert a user if it doesn't exist or get current set of application domains
        let applications = match self.apps_by_user.entry(user_id) {
            Occupied(e) => e.into_mut(),
            Vacant(e) => e.insert(HashMap::default()),
        };

        // Insert the application and return false if it is already registered
        if applications.insert(domain_name, app_user_id).is_some() {
            return false;
        }

        self.app_attributes.insert(app_user_id, HashSet::new());
        self.app_user_to_user.insert(app_user_id, user_id).is_none()
    }

    pub fn set_attributes(
        &mut self,
        user_id: UserId,
        domain_name: String,
        attributes: Vec<AttributeId>,
    ) -> bool {
        let app_user_id = match self.lookup_app_user_id(&user_id, &domain_name) {
            None => return false,
            Some(auid) => *auid,
        };

        let attribute_set = attributes.iter().cloned().collect();
        self.app_attributes.insert(app_user_id, attribute_set);
        true
    }
    }

    pub fn domains(&self, user_id: UserId) -> Vec<String> {
        match self.apps_by_user.get(&user_id) {
            None => Vec::default(),
            Some(apps) => apps.keys().cloned().collect(),
        }
    }

    pub fn attributes_by_id(&self, app_user_id: &AppUserId) -> Option<&HashSet<AttributeId>> {
        let registered = self.app_user_to_user.contains_key(app_user_id);
        if !registered {
            return None;
        }

        let attributes = match self.app_attributes.get(app_user_id) {
            None => return None,
            Some(attrs) => attrs,
        };

        Some(attributes)
    }

    pub fn attributes(
        &self,
        user_id: &UserId,
        domain_name: String,
    ) -> Option<&HashSet<AttributeId>> {
        let app_user_id = match self.lookup_app_user_id(user_id, &domain_name) {
            None => return None,
            Some(auid) => auid,
        };

        self.attributes_by_id(app_user_id)
    }

    fn lookup_app_user_id(&self, user_id: &UserId, domain_name: &str) -> Option<&AppUserId> {
        match self.apps_by_user.get(user_id) {
            None => None,
            Some(apps) => apps.get(domain_name),
        }
    }

    fn derive_app_user_id(&self, _user_id: &UserId, _domain_name: &str) -> AppUserId {
        // TODO:
        // Hardcoded with my dfx openchat identity
        Principal::from_text("t3mli-46uhw-2flyo-aer5b-ip3pt-ij5jc-whvah-hcbbp-d7qli-emafc-aae")
            .unwrap()
            .into()
    }
}
