use candid::Principal;

mod application;
mod application_id;
mod attribute_id;
mod attribute_value;
mod error;
mod indexed_event;
mod phone_number;
mod user_id;
mod verification_code;

pub use application::*;
pub use application_id::*;
pub use attribute_id::*;
pub use attribute_value::*;
pub use error::*;
pub use indexed_event::*;
pub use phone_number::*;
pub use user_id::*;
pub use verification_code::*;

pub type CanisterId = Principal;
pub type Milliseconds = u64;
pub type TimestampMillis = u64;
pub type TimestampNanos = u64;
