mod dynamodb;
mod ses;
mod sns;

use crate::dynamodb::DynamoDbClient;
use crate::ses::SesClient;
use crate::sns::SnsClient;
use candid::Principal;
use log::info;
use std::str::FromStr;
use types::Error;
use verification_code_sender::ic_agent::{IcAgent, IcAgentConfig};
use verification_code_sender::runner;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init();
    info!("Starting...");

    let canister_id = Principal::from_text(dotenv::var("NOTIFICATIONS_CANISTER_ID")?).unwrap();
    let dynamodb_client = DynamoDbClient::build(canister_id);
    let ic_url = dotenv::var("IC_URL")?;
    let ic_identity_pem = dotenv::var("IC_IDENTITY_PEM")?;
    let is_development = bool::from_str(&dotenv::var("IS_DEVELOPMENT")?).unwrap();

    let ic_agent_config = IcAgentConfig {
        ic_url,
        ic_identity_pem,
        fetch_root_key: is_development,
    };
    let ic_agent = IcAgent::build(&ic_agent_config, canister_id).await?;
    let sns_client = SnsClient::build()?;
    let ses_client = SesClient::build()?;

    info!("Configuration complete");

    runner::run(&ic_agent, &dynamodb_client, &sns_client, &ses_client).await
}
