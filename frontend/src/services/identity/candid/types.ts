import type { Principal } from '@dfinity/principal';
export interface AppEmailFacet {
  'any_verified' : boolean,
  'attributes' : Array<AppVerifiableEmailAddress>,
}
export interface AppPhoneFacet {
  'any_verified' : boolean,
  'attributes' : Array<AppVerifiablePhoneNumber>,
}
export type AppProfileArgs = {};
export type AppProfileResponse = { 'Success' : AppProfileSuccessResult } |
  { 'IdentityNotFound' : null } |
  { 'ApplicationNotRegistered' : null };
export interface AppProfileSuccessResult {
  'email' : AppEmailFacet,
  'phone' : AppPhoneFacet,
}
export interface AppVerifiableEmailAddress {
  'verified' : boolean,
  'value' : string,
}
export interface AppVerifiablePhoneNumber {
  'verified' : boolean,
  'value' : PhoneNumber,
}
export interface Application { 'domain_name' : string }
export type AttributeId = bigint;
export type AttributeValue = { 'Email' : string } |
  { 'Phone' : PhoneNumber };
export interface ConfirmVerificationCodeArgs {
  'attribute_id' : AttributeId,
  'verification_code' : string,
}
export type ConfirmVerificationCodeResponse = { 'AttributeNotFound' : null } |
  { 'VerificationCodeIncorrect' : null } |
  { 'Success' : null } |
  { 'AlreadyVerified' : null } |
  { 'VerificationCodeExpired' : null } |
  { 'IdentityNotFound' : null } |
  { 'VerificationCodeInvalid' : null };
export interface Delegation {
  'pubkey' : PublicKey,
  'targets' : [] | [Array<Principal>],
  'expiration' : TimestampMillis,
}
export interface EmailFacet { 'addresses' : Array<VerifiableEmailAddress> }
export type FrontendHostname = string;
export type GetDelegationResponse = { 'no_such_delegation' : null } |
  { 'signed_delegation' : SignedDelegation };
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
  'apps' : Array<Application>,
  'identity' : Identity,
}
export type PublicKey = Array<number>;
export interface RegisterApplicationArgs { 'app_domain_name' : string }
export type RegisterApplicationResponse = { 'AlreadyRegistered' : null } |
  { 'Success' : null };
export interface RegisterAttributeArgs { 'value' : AttributeValue }
export type RegisterAttributeResponse = { 'AlreadyRegistered' : null } |
  { 'Success' : RegisterAttributeSuccessResult } |
  { 'InvalidValue' : null };
export interface RegisterAttributeSuccessResult { 'attribute_id' : AttributeId }
export interface RemoveAttributeArgs { 'attribute_id' : AttributeId }
export type RemoveAttributeResponse = { 'AttributeNotFound' : null } |
  { 'Success' : null } |
  { 'IdentityNotFound' : null };
export interface RemoveVerificationCodesArgs { 'up_to_index' : bigint }
export type RemoveVerificationCodesResponse = { 'NotAuthorized' : null } |
  { 'Success' : null };
export interface SendVerificationCodeArgs { 'attribute_id' : AttributeId }
export type SendVerificationCodeResponse = { 'AttributeNotFound' : null } |
  { 'Unsupported' : null } |
  { 'Success' : null } |
  { 'AlreadyVerified' : null } |
  { 'IdentityNotFound' : null } |
  { 'AlreadySent' : null };
export type SessionKey = PublicKey;
export interface SetVisibleAttributesArgs {
  'attributes' : Array<AttributeId>,
  'app_domain_name' : string,
}
export type SetVisibleAttributesResponse = { 'Success' : null };
export interface SignedDelegation {
  'signature' : Array<number>,
  'delegation' : Delegation,
}
export type TimestampMillis = bigint;
export type UserKey = PublicKey;
export interface VerifiableEmailAddress {
  'id' : AttributeId,
  'status' : VerificationCodeStatus,
  'added' : TimestampMillis,
  'value' : string,
}
export interface VerifiablePhoneNumber {
  'id' : AttributeId,
  'status' : VerificationCodeStatus,
  'added' : TimestampMillis,
  'value' : PhoneNumber,
}
export interface VerificationCode {
  'code' : string,
  'target' : VerificationCodeTarget,
}
export type VerificationCodeStatus = { 'Sent' : TimestampMillis } |
  { 'Verified' : TimestampMillis } |
  { 'Expired' : TimestampMillis };
export type VerificationCodeTarget = { 'Email' : string } |
  { 'Phone' : string };
export interface VerificationCodesArgs { 'from_index' : bigint }
export type VerificationCodesResponse = { 'NotAuthorized' : null } |
  { 'Success' : VerificationCodesSuccessResult };
export interface VerificationCodesSuccessResult {
  'verification_codes' : Array<IndexedVerificationCode>,
}
export interface VisibleAttributesArgs { 'app_domain_name' : string }
export type VisibleAttributesResponse = {
    'Success' : VisibleAttributesSuccessResult
  } |
  { 'ApplicationNotRegistered' : null };
export interface VisibleAttributesSuccessResult {
  'attributes' : Array<AttributeId>,
}
export interface _SERVICE {
  'app_profile' : (arg_0: AppProfileArgs) => Promise<AppProfileResponse>,
  'confirm_verification_code' : (arg_0: ConfirmVerificationCodeArgs) => Promise<
      ConfirmVerificationCodeResponse
    >,
  'ext_remove_verification_codes' : (
      arg_0: RemoveVerificationCodesArgs,
    ) => Promise<RemoveVerificationCodesResponse>,
  'ext_verification_codes' : (arg_0: VerificationCodesArgs) => Promise<
      VerificationCodesResponse
    >,
  'get_delegation' : (
      arg_0: FrontendHostname,
      arg_1: SessionKey,
      arg_2: TimestampMillis,
    ) => Promise<GetDelegationResponse>,
  'init_salt' : () => Promise<undefined>,
  'prepare_delegation' : (
      arg_0: FrontendHostname,
      arg_1: SessionKey,
      arg_2: [] | [bigint],
    ) => Promise<[UserKey, TimestampMillis]>,
  'profile' : (arg_0: ProfileArgs) => Promise<ProfileResponse>,
  'register_application' : (arg_0: RegisterApplicationArgs) => Promise<
      RegisterApplicationResponse
    >,
  'register_attribute' : (arg_0: RegisterAttributeArgs) => Promise<
      RegisterAttributeResponse
    >,
  'remove_attribute' : (arg_0: RemoveAttributeArgs) => Promise<
      RemoveAttributeResponse
    >,
  'send_verification_code' : (arg_0: SendVerificationCodeArgs) => Promise<
      SendVerificationCodeResponse
    >,
  'set_visible_attributes' : (arg_0: SetVisibleAttributesArgs) => Promise<
      SetVisibleAttributesResponse
    >,
  'visible_attributes' : (arg_0: VisibleAttributesArgs) => Promise<
      VisibleAttributesResponse
    >,
}
