use async_trait::async_trait;
use aws_sdk_ses::model::{Body, Content, Destination, Message};
use aws_sdk_ses::Client;
use log::info;
use types::Error;
use verification_code_sender::email_sender::EmailSender;

#[allow(dead_code)]
pub struct SesClient {
    client: Client,
}

impl SesClient {
    pub fn build() -> Result<SesClient, Error> {
        let config = aws_sdk_ses::Config::builder().build();

        let client = Client::from_conf(config);

        info!("SesClient created");

        Ok(SesClient { client })
    }
}

#[async_trait]
impl EmailSender for SesClient {
    async fn send(&self, email_address: String, code: String) -> Result<(), Error> {
        let destination = Destination::builder()
            .set_to_addresses(Some(vec![email_address]))
            .build();

        let title_content = Content::builder()
            .data("privIC email address verification")
            .build();

        let body_content = Content::builder()
            .data(format!(
                "Your privIC email address verification code is {} and will expire in 1 hour",
                code
            ))
            .build();

        let message = Message::builder()
            .subject(title_content)
            .body(Body::builder().text(body_content).build())
            .build();

        self.client
            .send_email()
            .source("verification@privic.com")
            .destination(destination)
            .message(message)
            .send()
            .await?;

        Ok(())
    }
}
