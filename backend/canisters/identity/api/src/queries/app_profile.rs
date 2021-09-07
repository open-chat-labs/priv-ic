use candid::CandidType;
use serde::Deserialize;
use types::PhoneNumber;

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    IdentityNotFound,
    ApplicationNotRegistered,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SuccessResult {
    pub email: VerifiableFacet<String>,
    pub phone: VerifiableFacet<PhoneNumber>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct VerifiableFacet<T: CandidType + Clone> {
    pub any_verified: bool,
    pub attributes: Vec<VerifiableAttribute<T>>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct VerifiableAttribute<T: CandidType + Clone> {
    pub value: T,
    pub verified: bool,
}
