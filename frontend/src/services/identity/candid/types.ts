import type { Principal } from '@dfinity/principal';
export interface App { 'domain_name' : string }
export interface AppEmailAddress { 'verified' : boolean, 'value' : string }
export interface AppEmailFacet {
  'any_verified' : boolean,
  'addresses' : Array<AppEmailAddress>,
}
export interface AppPhoneFacet {
  'any_verified' : boolean,
  'numbers' : Array<AppPhoneNumber>,
}
export interface AppPhoneNumber { 'verified' : boolean, 'value' : string }
export type AppProfileViewArgs = {};
export type AppProfileViewResponse = { 'NotFound' : null } |
  { 'Success' : AppProfileViewSuccessResult };
export interface AppProfileViewSuccessResult {
  'email' : AppEmailFacet,
  'phone' : AppPhoneFacet,
}
export interface ConfirmVerificationCodeArgs {
  'verification_code' : string,
  'field_id' : FieldId,
}
export type ConfirmVerificationCodeResponse = { 'NotSent' : null } |
  { 'AlreadyConfirmed' : null } |
  { 'NotFound' : null } |
  { 'Success' : null } |
  { 'ConfirmationCodeExpired' : null } |
  { 'ConfirmationCodeIncorrect' : null };
export interface EmailFacet { 'addresses' : Array<VerifiableEmailAddress> }
export type FieldId = bigint;
export interface Identity { 'email' : EmailFacet, 'phone' : PhoneFacet }
export interface IndexedVerificationCode {
  'value' : VerificationCode,
  'index' : bigint,
}
export interface InitArgs {
  'verification_code_sender_principals' : Array<Principal>,
}
export interface PhoneFacet { 'numbers' : Array<VerifiablePhoneNumber> }
export interface PhoneNumber { 'country_code' : number, 'number' : string }
export type ProfileArgs = {};
export type ProfileResponse = { 'NotFound' : null } |
  { 'Success' : ProfileSuccessResult };
export interface ProfileSuccessResult {
  'apps' : Array<App>,
  'identity' : Identity,
}
export interface RegisterEmailAddressSuccessResult { 'field_id' : FieldId }
export interface RegisterEmailArgs { 'email_address' : string }
export type RegisterEmailResponse = { 'AlreadyRegistered' : null } |
  { 'Success' : RegisterEmailAddressSuccessResult } |
  { 'InvalidEmailAddress' : null };
export interface RegisterPhoneNumberArgs { 'phone_number' : PhoneNumber }
export type RegisterPhoneNumberResponse = { 'AlreadyRegistered' : null } |
  { 'Success' : RegisterPhoneNumberSuccessResult } |
  { 'InvalidPhoneNumber' : null };
export interface RegisterPhoneNumberSuccessResult { 'field_id' : FieldId }
export interface RemoveVerificationCodesArgs { 'up_to_index' : bigint }
export type RemoveVerificationCodesResponse = { 'NotAuthorized' : null } |
  { 'Success' : null };
export interface SendVerificationCodeArgs { 'field_id' : FieldId }
export type SendVerificationCodeResponse = { 'NotFound' : null } |
  { 'Success' : null } |
  { 'AlreadySent' : null };
export interface SetVisibleProfileFieldsArgs {
  'fields' : Array<FieldId>,
  'app_domain_name' : string,
}
export type SetVisibleProfileFieldsResponse = { 'Success' : null };
export type TimestampMillis = bigint;
export interface VerifiableEmailAddress {
  'id' : FieldId,
  'status' : VerificationCodeStatus,
  'added' : TimestampMillis,
  'value' : string,
}
export interface VerifiablePhoneNumber {
  'id' : FieldId,
  'status' : VerificationCodeStatus,
  'added' : TimestampMillis,
  'value' : PhoneNumber,
}
export interface VerificationCode {
  'code' : string,
  'target' : VerificationCodeTarget,
}
export interface VerificationCodeSentState {
  'code' : string,
  'date' : TimestampMillis,
}
export type VerificationCodeStatus = { 'Sent' : VerificationCodeSentState } |
  { 'Verified' : VerificationCodeVerifiedState } |
  { 'Pending' : null };
export type VerificationCodeTarget = { 'Email' : string } |
  { 'Phone' : string };
export interface VerificationCodeVerifiedState { 'date' : TimestampMillis }
export interface VerificationCodesArgs { 'from_index' : bigint }
export type VerificationCodesResponse = { 'NotAuthorized' : null } |
  { 'Success' : VerificationCodesSuccessResult };
export interface VerificationCodesSuccessResult {
  'verification_codes' : Array<IndexedVerificationCode>,
}
export interface VisibleProfileFieldsArgs { 'app_domain_name' : string }
export type VisibleProfileFieldsResponse = { 'NotFound' : null } |
  { 'Success' : VisibleProfileFieldsSuccessResult };
export interface VisibleProfileFieldsSuccessResult { 'fields' : Array<FieldId> }
export interface _SERVICE {
  'app_profile_view' : (arg_0: AppProfileViewArgs) => Promise<
      AppProfileViewResponse
    >,
  'confirm_verification_code' : (arg_0: ConfirmVerificationCodeArgs) => Promise<
      ConfirmVerificationCodeResponse
    >,
  'ext_remove_verification_codes' : (
      arg_0: RemoveVerificationCodesArgs,
    ) => Promise<RemoveVerificationCodesResponse>,
  'ext_verification_codes' : (arg_0: VerificationCodesArgs) => Promise<
      VerificationCodesResponse
    >,
  'profile' : (arg_0: ProfileArgs) => Promise<ProfileResponse>,
  'register_email' : (arg_0: RegisterEmailArgs) => Promise<
      RegisterEmailResponse
    >,
  'register_phone_number' : (arg_0: RegisterPhoneNumberArgs) => Promise<
      RegisterPhoneNumberResponse
    >,
  'send_verification_code' : (arg_0: SendVerificationCodeArgs) => Promise<
      SendVerificationCodeResponse
    >,
  'set_visible_profile_fields' : (
      arg_0: SetVisibleProfileFieldsArgs,
    ) => Promise<SetVisibleProfileFieldsResponse>,
  'visible_profile_fields' : (arg_0: VisibleProfileFieldsArgs) => Promise<
      VisibleProfileFieldsResponse
    >,
}
