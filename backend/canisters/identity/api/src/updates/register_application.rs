use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub app_domain_name: String,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success,
    AlreadyRegistered,
}
