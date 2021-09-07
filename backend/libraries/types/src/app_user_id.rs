use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(
    CandidType, Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct AppUserId(Principal);

impl From<Principal> for AppUserId {
    fn from(principal: Principal) -> Self {
        AppUserId(principal)
    }
}

impl From<AppUserId> for Principal {
    fn from(app_user_id: AppUserId) -> Self {
        app_user_id.0
    }
}
