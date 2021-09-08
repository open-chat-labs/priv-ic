use async_trait::async_trait;
use aws_sdk_sns::Client;
use log::info;
use types::Error;
use verification_code_sender::sms_sender::SmsSender;

pub struct SnsClient {
    client: Client,
    sms_topic_arn: String,
}

impl SnsClient {
    pub fn build() -> Result<SnsClient, Error> {
        let config = aws_sdk_sns::Config::builder().build();

        let client = Client::from_conf(config);

        let sms_topic_arn = dotenv::var("SMS_TOPIC_ARN")?;

        info!("SnsClient created");

        Ok(SnsClient {
            client,
            sms_topic_arn,
        })
    }
}

#[async_trait]
impl SmsSender for SnsClient {
    async fn send(&self, phone_number: String, code: String) -> Result<(), Error> {
        self.client
            .publish()
            .phone_number(phone_number)
            .subject("PrivIC Verification Code")
            .message(format!(
                "Your PrivIC phone number verification code is {} and will expire in 1 hour",
                code
            ))
            .send()
            .await?;

        Ok(())
    }
}
