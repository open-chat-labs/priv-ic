use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(
    CandidType, Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct ApplicationId(Principal);

impl From<Principal> for ApplicationId {
    fn from(principal: Principal) -> Self {
        ApplicationId(principal)
    }
}

impl From<ApplicationId> for Principal {
    fn from(application_id: ApplicationId) -> Self {
        application_id.0
    }
}
