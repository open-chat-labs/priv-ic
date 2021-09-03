mod dummy_email_sender;
mod dummy_index_store;
mod dummy_sms_sender;

use crate::dummy_email_sender::DummyEmailSender;
use crate::dummy_index_store::DummyIndexStore;
use crate::dummy_sms_sender::DummySmsSender;
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
    let index = args.get(2).and_then(|i| i.parse::<u64>().ok());
    let canister_id = Principal::from_text(dotenv::var("IDENTITY_CANISTER_ID")?)?;
    let ic_url = dotenv::var("IC_URL")?;
    let ic_identity_pem = dotenv::var("IC_IDENTITY_PEM")?;
    let is_development = bool::from_str(&dotenv::var("IS_DEVELOPMENT")?).unwrap();

    let ic_agent_config = IcAgentConfig {
        ic_url,
        ic_identity_pem,
        fetch_root_key: !is_development,
    };
    let ic_agent = IcAgent::build(&ic_agent_config, canister_id).await?;
    let index_store = DummyIndexStore::new(index);
    let sms_sender = DummySmsSender::new();
    let email_sender = DummyEmailSender::new();

    match command {
        "send" => {
            actions::send_codes::run(&ic_agent, &index_store, &sms_sender, &email_sender).await
        }
        "remove" => actions::remove_codes::run(&ic_agent, &index_store).await,
        "auto" => runner::run(&ic_agent, &index_store, &sms_sender, &email_sender).await,
        _ => Err(format!("Unsupported command: {}", command).into()),
    }
}
