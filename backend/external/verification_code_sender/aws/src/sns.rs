use async_trait::async_trait;
use aws_sdk_sns::Client;
use log::info;
use types::Error;
use verification_code_sender::email_sender::EmailSender;
use verification_code_sender::sms_sender::SmsSender;

#[allow(dead_code)]
pub struct SnsClient {
    client: Client,
    sms_topic_arn: String,
    email_topic_arn: String,
}

impl SnsClient {
    pub fn build() -> Result<SnsClient, Error> {
        let config = aws_sdk_sns::Config::builder().build();

        let client = Client::from_conf(config);

        let sms_topic_arn = dotenv::var("SMS_TOPIC_ARN")?;
        let email_topic_arn = dotenv::var("EMAIL_TOPIC_ARN")?;

        info!("SnsClient created");

        Ok(SnsClient {
            client,
            sms_topic_arn,
            email_topic_arn,
        })
    }

    async fn publish(&self, topic: String, subject: String, message: String) -> Result<(), Error> {
        self.client
            .publish()
            .set_topic_arn(Some(topic))
            .set_subject(Some(subject))
            .set_message(Some(message))
            .send()
            .await?;

        Ok(())
    }
}

#[async_trait]
impl SmsSender for SnsClient {
    async fn send(&self, phone_number: String, code: String) -> Result<(), Error> {
        self.publish(self.sms_topic_arn.clone(), phone_number, code)
            .await
    }
}

#[async_trait]
impl EmailSender for SnsClient {
    async fn send(&self, email_address: String, code: String) -> Result<(), Error> {
        self.publish(self.email_topic_arn.clone(), email_address, code)
            .await
    }
}
