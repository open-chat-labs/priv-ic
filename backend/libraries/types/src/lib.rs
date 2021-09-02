use candid::Principal;

mod app;
mod error;
mod field_id;
mod identity;
mod phone_number;
mod verification_code;

pub use app::*;
pub use error::*;
pub use field_id::*;
pub use identity::*;
pub use phone_number::*;
pub use verification_code::*;

pub type CanisterId = Principal;
pub type Milliseconds = u64;
pub type TimestampMillis = u64;
pub type TimestampNanos = u64;
