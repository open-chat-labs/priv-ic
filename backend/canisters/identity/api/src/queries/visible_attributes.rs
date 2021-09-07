use candid::CandidType;
use serde::Deserialize;
use types::AttributeId;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub app_domain_name: String,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    ApplicationNotRegistered,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub attributes: Vec<AttributeId>,
}
