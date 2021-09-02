use async_trait::async_trait;
use std::borrow::BorrowMut;
use std::sync::Mutex;
use types::Error;
use verification_code_sender::sms_sender::SmsSender;

pub struct DummySmsSender {
    sms_messages_sent: Mutex<Vec<(String, String)>>,
}

impl DummySmsSender {
    pub fn new() -> DummySmsSender {
        DummySmsSender {
            sms_messages_sent: Mutex::new(Vec::new()),
        }
    }
}

#[async_trait]
impl SmsSender for DummySmsSender {
    async fn send(&self, phone_number: String, code: String) -> Result<(), Error> {
        match self.sms_messages_sent.lock() {
            Ok(mut mutex) => {
                mutex.borrow_mut().push((phone_number, code));
                Ok(())
            }
            Err(error) => Err(error.to_string().into()),
        }
    }
}
