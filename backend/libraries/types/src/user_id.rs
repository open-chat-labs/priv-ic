use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(
    CandidType, Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct UserId(Principal);

impl From<Principal> for UserId {
    fn from(principal: Principal) -> Self {
        UserId(principal)
    }
}

impl From<UserId> for Principal {
    fn from(user_id: UserId) -> Self {
        user_id.0
    }
}
