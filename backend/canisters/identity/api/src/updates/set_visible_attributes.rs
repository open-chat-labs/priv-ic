use candid::CandidType;
use serde::Deserialize;
use types::AttributeId;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub app_domain_name: String,
    pub attributes: Vec<AttributeId>,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success,
}
