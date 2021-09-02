use async_trait::async_trait;
use std::borrow::BorrowMut;
use std::sync::Mutex;
use types::Error;
use verification_code_sender::email_sender::EmailSender;

pub struct DummyEmailSender {
    emails_sent: Mutex<Vec<(String, String)>>,
}

impl DummyEmailSender {
    pub fn new() -> DummyEmailSender {
        DummyEmailSender {
            emails_sent: Mutex::new(Vec::new()),
        }
    }
}

#[async_trait]
impl EmailSender for DummyEmailSender {
    async fn send(&self, email_address: String, code: String) -> Result<(), Error> {
        match self.emails_sent.lock() {
            Ok(mut mutex) => {
                mutex.borrow_mut().push((email_address, code));
                Ok(())
            }
            Err(error) => Err(error.to_string().into()),
        }
    }
}
