use async_trait::async_trait;
use aws_sdk_sns::Client;
use log::info;
use types::Error;
use verification_code_sender::sms_sender::SmsSender;

pub struct SnsClient {
    client: Client,
}

impl SnsClient {
    pub fn build() -> Result<SnsClient, Error> {
        let config = aws_sdk_sns::Config::builder().build();

        let client = Client::from_conf(config);

        info!("SnsClient created");

        Ok(SnsClient {
            client,
        })
    }
}

#[async_trait]
impl SmsSender for SnsClient {
    async fn send(&self, phone_number: String, code: String) -> Result<(), Error> {
        self.client
            .publish()
            .phone_number(phone_number)
            .subject("privIC")
            .message(format!(
                "Your privIC phone number verification code is {} and will expire in 1 hour",
                code
            ))
            .send()
            .await?;

        Ok(())
    }
}
