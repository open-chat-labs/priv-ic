use async_trait::async_trait;
use types::Error;

#[async_trait]
pub trait EmailSender {
    async fn send(&self, email_address: String, code: String) -> Result<(), Error>;
}
