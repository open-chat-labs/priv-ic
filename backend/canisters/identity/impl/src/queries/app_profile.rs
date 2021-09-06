use crate::model::identity::{Attribute, Identity, VerificationCodeStatus};
use crate::HashSet;
use crate::{RuntimeState, RUNTIME_STATE};
use ic_cdk_macros::query;
use identity_canister_api::app_profile::{Response::*, *};
use types::{AttributeId, PhoneNumber};

#[query]
fn app_profile(_args: Args) -> Response {
    RUNTIME_STATE.with(|state| app_profile_impl(state.borrow().as_ref().unwrap()))
}

fn app_profile_impl(runtime_state: &RuntimeState) -> Response {
    let application_id = runtime_state.env.caller().into();

    // Lookup the user_id given the application_id
    let user_id = match runtime_state.data.applications.user_id(&application_id) {
        None => return ApplicationNotRegistered,
        Some(uid) => uid,
    };

    // Lookup the user identity
    let identity = match runtime_state.data.identities.get(user_id) {
        None => return IdentityNotFound,
        Some(i) => i,
    };

    // Lookup the application attributes
    let attributes = match runtime_state
        .data
        .applications
        .attributes_by_id(&application_id)
    {
        None => return ApplicationNotRegistered,
        Some(attr) => attr,
    };

    // Map the identity to the application view
    Success(map_to_response(identity, attributes))
}

fn map_to_response(identity: &Identity, attributes: &HashSet<AttributeId>) -> SuccessResult {
    let mut any_email_verified = false;
    let mut any_phone_verified = false;
    let mut email_attributes: Vec<VerifiableAttribute<String>> = Vec::new();
    let mut phone_attributes: Vec<VerifiableAttribute<PhoneNumber>> = Vec::new();
    for attribute in identity.values() {
        match attribute {
            Attribute::EmailAddress(email) => {
                let verified = matches!(email.status, VerificationCodeStatus::Verified(_));
                any_email_verified |= verified;
                if attributes.contains(&email.id) {
                    email_attributes.push(VerifiableAttribute::<String> {
                        value: email.value.clone(),
                        verified,
                    });
                }
            }
            Attribute::PhoneNumber(phone) => {
                let verified = matches!(phone.status, VerificationCodeStatus::Verified(_));
                any_phone_verified |= verified;
                if attributes.contains(&phone.id) {
                    phone_attributes.push(VerifiableAttribute::<PhoneNumber> {
                        value: phone.value.clone(),
                        verified,
                    });
                }
            }
        }
    }

    SuccessResult {
        email: VerifiableFacet::<String> {
            any_verified: any_email_verified,
            attributes: email_attributes,
        },
        phone: VerifiableFacet::<PhoneNumber> {
            any_verified: any_phone_verified,
            attributes: phone_attributes,
        },
    }
}
