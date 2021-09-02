use crate::actions::{remove_codes, send_codes};
use crate::index_store::IndexStore;
use crate::verification_code_reader::VerificationCodeReader;
use log::{error, info};
use tokio::time;
use types::Error;

pub async fn run(
    code_reader: &dyn VerificationCodeReader,
    index_store: &dyn IndexStore,
) -> Result<(), Error> {
    info!("Starting runner");

    let mut interval = time::interval(time::Duration::from_secs(2));
    loop {
        for _ in 0..30 {
            if let Err(err) = send_codes::run(code_reader, index_store).await {
                error!("push notifications failed: {:?}", err);
            }

            interval.tick().await;
        }

        if let Err(err) = remove_codes::run(code_reader, index_store).await {
            error!("prune notifications failed: {:?}", err);
        }
    }
}
