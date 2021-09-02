pub mod dummy_index_store;

use candid::Principal;
use std::str::FromStr;
use types::Error;
use verification_code_sender::ic_agent::{IcAgent, IcAgentConfig};
use verification_code_sender::{actions, runner};

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init();
    let args: Vec<String> = std::env::args().collect();
    let command: &str = &args[1];
    let index = args.get(2).map_or(None, |i| i.parse::<u64>().ok());
    let canister_id = Principal::from_text(dotenv::var("IDENTITY_CANISTER_ID")?)?;
    let ic_url = dotenv::var("IC_URL")?;
    let ic_identity_pem = dotenv::var("IC_IDENTITY_PEM")?;
    let is_production = bool::from_str(&dotenv::var("IS_PRODUCTION")?).unwrap();

    let ic_agent_config = IcAgentConfig {
        ic_url,
        ic_identity_pem,
        fetch_root_key: !is_production,
    };
    let ic_agent = IcAgent::build(&ic_agent_config, canister_id).await?;
    let index_store = crate::dummy_index_store::DummyIndexStore::new(index);

    match command {
        "send" => actions::send_codes::run(&ic_agent, &index_store).await,
        "remove" => actions::remove_codes::run(&ic_agent, &index_store).await,
        "auto" => runner::run(&ic_agent, &index_store).await,
        _ => Err(format!("Unsupported command: {}", command).into()),
    }
}
