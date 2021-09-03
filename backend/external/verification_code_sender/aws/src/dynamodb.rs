use async_trait::async_trait;
use aws_sdk_dynamodb::model::AttributeValue;
use aws_sdk_dynamodb::{Blob, Client};
use log::info;
use std::str::FromStr;
use types::{CanisterId, Error};
use verification_code_sender::index_store::IndexStore;

const TABLE_NAME: &str = "notification_indexes";

pub struct DynamoDbClient {
    client: Client,
    canister_key: AttributeValue,
}

impl DynamoDbClient {
    pub fn build(canister_id: CanisterId) -> DynamoDbClient {
        let config = aws_sdk_dynamodb::Config::builder().build();

        let client = Client::from_conf(config);

        info!("DynamoDbClient created");

        DynamoDbClient {
            client,
            canister_key: AttributeValue::B(Blob::new(canister_id.as_slice().to_vec())),
        }
    }
}

#[async_trait]
impl IndexStore for DynamoDbClient {
    async fn get_index_processed_up_to(&self) -> Result<Option<u64>, Error> {
        let response = self
            .client
            .get_item()
            .table_name(TABLE_NAME)
            .key("canister_id", self.canister_key.clone())
            .send()
            .await?;

        if let Some(item) = response.item {
            let value = item.get("index").unwrap().as_n().unwrap();
            Ok(Some(u64::from_str(value).unwrap()))
        } else {
            Ok(None)
        }
    }

    async fn set_index_processed_up_to(&self, index: u64) -> Result<(), Error> {
        self.client
            .put_item()
            .table_name(TABLE_NAME)
            .item("canister_id", self.canister_key.clone())
            .item("index", AttributeValue::N(index.to_string()))
            .send()
            .await?;

        Ok(())
    }
}
