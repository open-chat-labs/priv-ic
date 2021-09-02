use candid::CandidType;
use serde::Deserialize;
use types::{App, Identity};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    NotFound,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub identity: Identity,
    pub apps: Vec<App>,
}
