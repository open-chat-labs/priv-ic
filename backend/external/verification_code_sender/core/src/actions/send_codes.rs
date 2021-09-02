use crate::index_store::IndexStore;
use crate::verification_code_reader::VerificationCodeReader;
use types::Error;

pub async fn run(
    code_reader: &dyn VerificationCodeReader,
    index_store: &dyn IndexStore,
) -> Result<(), Error> {
    let from_index = index_store
        .get_index_processed_up_to()
        .await?
        .map_or(0, |i| i + 1);

    let verification_codes = code_reader.get(from_index).await?;

    if let Some(latest_index) = verification_codes
        .verification_codes
        .last()
        .map(|e| e.index)
    {
        // TODO send the codes

        index_store.set_index_processed_up_to(latest_index).await?;
    }

    Ok(())
}
