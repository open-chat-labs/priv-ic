use crate::index_store::IndexStore;
use crate::verification_code_reader::VerificationCodeReader;
use types::Error;

pub async fn run(
    code_reader: &dyn VerificationCodeReader,
    index_store: &dyn IndexStore,
) -> Result<(), Error> {
    let maybe_index_processed_up_to = index_store.get_index_processed_up_to().await?;

    if let Some(index_processed_up_to) = maybe_index_processed_up_to {
        code_reader.remove(index_processed_up_to).await?;
    }

    Ok(())
}
