use async_trait::async_trait;
use identity_canister_api::ext_verification_codes;
use types::Error;

#[async_trait]
pub trait VerificationCodeReader {
    async fn get(&self, from_index: u64) -> Result<ext_verification_codes::SuccessResult, Error>;
    async fn remove(&self, up_to_index: u64) -> Result<(), Error>;
}
