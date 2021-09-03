use candid::CandidType;
use serde::Deserialize;
use types::AttributeId;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub attribute_id: AttributeId,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success,
    AlreadySent,
    AlreadyVerified,
    IdentityNotFound,
    AttributeNotFound,
    Unsupported,
}
