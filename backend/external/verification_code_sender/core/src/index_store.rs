use async_trait::async_trait;
use types::Error;

#[async_trait]
pub trait IndexStore {
    async fn get_index_processed_up_to(&self) -> Result<Option<u64>, Error>;
    async fn set_index_processed_up_to(&self, index: u64) -> Result<(), Error>;
}
