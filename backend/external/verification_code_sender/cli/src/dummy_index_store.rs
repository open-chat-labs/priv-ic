use async_trait::async_trait;
use std::ops::DerefMut;
use std::sync::Mutex;
use types::Error;
use verification_code_sender::index_store::IndexStore;

pub struct DummyIndexStore {
    index_processed_up_to: Mutex<Option<u64>>,
}

impl DummyIndexStore {
    pub fn new(index: Option<u64>) -> DummyIndexStore {
        DummyIndexStore {
            index_processed_up_to: Mutex::new(index),
        }
    }
}

#[async_trait]
impl IndexStore for DummyIndexStore {
    async fn get_index_processed_up_to(&self) -> Result<Option<u64>, Error> {
        match self.index_processed_up_to.lock() {
            Ok(mutex) => Ok(*mutex),
            Err(error) => Err(error.to_string().into()),
        }
    }

    async fn set_index_processed_up_to(&self, index: u64) -> Result<(), Error> {
        match self.index_processed_up_to.lock() {
            Ok(mut mutex) => {
                *mutex.deref_mut() = Some(index);
                Ok(())
            }
            Err(error) => Err(error.to_string().into()),
        }
    }
}
