export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'verification_code_sender_principals' : IDL.Vec(IDL.Principal),
  });
  const AppProfileArgs = IDL.Record({});
  const AppVerifiableEmailAddress = IDL.Record({
    'verified' : IDL.Bool,
    'value' : IDL.Text,
  });
  const AppEmailFacet = IDL.Record({
    'any_verified' : IDL.Bool,
    'attributes' : IDL.Vec(AppVerifiableEmailAddress),
  });
  const PhoneNumber = IDL.Record({
    'country_code' : IDL.Nat16,
    'number' : IDL.Text,
  });
  const AppVerifiablePhoneNumber = IDL.Record({
    'verified' : IDL.Bool,
    'value' : PhoneNumber,
  });
  const AppPhoneFacet = IDL.Record({
    'any_verified' : IDL.Bool,
    'attributes' : IDL.Vec(AppVerifiablePhoneNumber),
  });
  const AppProfileSuccessResult = IDL.Record({
    'email' : AppEmailFacet,
    'phone' : AppPhoneFacet,
  });
  const AppProfileResponse = IDL.Variant({
    'Success' : AppProfileSuccessResult,
    'IdentityNotFound' : IDL.Null,
    'ApplicationNotRegistered' : IDL.Null,
  });
  const AttributeId = IDL.Nat;
  const ConfirmVerificationCodeArgs = IDL.Record({
    'attribute_id' : AttributeId,
    'verification_code' : IDL.Text,
  });
  const ConfirmVerificationCodeResponse = IDL.Variant({
    'AttributeNotFound' : IDL.Null,
    'VerificationCodeIncorrect' : IDL.Null,
    'Success' : IDL.Null,
    'AlreadyVerified' : IDL.Null,
    'VerificationCodeExpired' : IDL.Null,
    'IdentityNotFound' : IDL.Null,
    'VerificationCodeInvalid' : IDL.Null,
  });
  const RemoveVerificationCodesArgs = IDL.Record({ 'up_to_index' : IDL.Nat64 });
  const RemoveVerificationCodesResponse = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Success' : IDL.Null,
  });
  const VerificationCodesArgs = IDL.Record({ 'from_index' : IDL.Nat64 });
  const VerificationCodeTarget = IDL.Variant({
    'Email' : IDL.Text,
    'Phone' : IDL.Text,
  });
  const VerificationCode = IDL.Record({
    'code' : IDL.Text,
    'target' : VerificationCodeTarget,
  });
  const IndexedVerificationCode = IDL.Record({
    'value' : VerificationCode,
    'index' : IDL.Nat64,
  });
  const VerificationCodesSuccessResult = IDL.Record({
    'verification_codes' : IDL.Vec(IndexedVerificationCode),
  });
  const VerificationCodesResponse = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Success' : VerificationCodesSuccessResult,
  });
  const ProfileArgs = IDL.Record({});
  const Application = IDL.Record({ 'domain_name' : IDL.Text });
  const TimestampMillis = IDL.Nat64;
  const VerificationCodeStatus = IDL.Variant({
    'Sent' : TimestampMillis,
    'Verified' : TimestampMillis,
    'Expired' : TimestampMillis,
  });
  const VerifiableEmailAddress = IDL.Record({
    'id' : AttributeId,
    'status' : VerificationCodeStatus,
    'added' : TimestampMillis,
    'value' : IDL.Text,
  });
  const EmailFacet = IDL.Record({
    'addresses' : IDL.Vec(VerifiableEmailAddress),
  });
  const VerifiablePhoneNumber = IDL.Record({
    'id' : AttributeId,
    'status' : VerificationCodeStatus,
    'added' : TimestampMillis,
    'value' : PhoneNumber,
  });
  const PhoneFacet = IDL.Record({ 'numbers' : IDL.Vec(VerifiablePhoneNumber) });
  const Identity = IDL.Record({ 'email' : EmailFacet, 'phone' : PhoneFacet });
  const ProfileSuccessResult = IDL.Record({
    'apps' : IDL.Vec(Application),
    'identity' : Identity,
  });
  const ProfileResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'Success' : ProfileSuccessResult,
  });
  const RegisterApplicationArgs = IDL.Record({ 'app_domain_name' : IDL.Text });
  const RegisterApplicationResponse = IDL.Variant({
    'AlreadyRegistered' : IDL.Null,
    'Success' : IDL.Null,
  });
  const AttributeValue = IDL.Variant({
    'Email' : IDL.Text,
    'Phone' : PhoneNumber,
  });
  const RegisterAttributeArgs = IDL.Record({ 'value' : AttributeValue });
  const RegisterAttributeSuccessResult = IDL.Record({
    'attribute_id' : AttributeId,
  });
  const RegisterAttributeResponse = IDL.Variant({
    'AlreadyRegistered' : IDL.Null,
    'Success' : RegisterAttributeSuccessResult,
    'InvalidValue' : IDL.Null,
  });
  const RemoveAttributeArgs = IDL.Record({ 'attribute_id' : AttributeId });
  const RemoveAttributeResponse = IDL.Variant({
    'AttributeNotFound' : IDL.Null,
    'Success' : IDL.Null,
    'IdentityNotFound' : IDL.Null,
  });
  const SendVerificationCodeArgs = IDL.Record({ 'attribute_id' : AttributeId });
  const SendVerificationCodeResponse = IDL.Variant({
    'AttributeNotFound' : IDL.Null,
    'Unsupported' : IDL.Null,
    'Success' : IDL.Null,
    'AlreadyVerified' : IDL.Null,
    'IdentityNotFound' : IDL.Null,
    'AlreadySent' : IDL.Null,
  });
  const SetVisibleAttributesArgs = IDL.Record({
    'attributes' : IDL.Vec(AttributeId),
    'app_domain_name' : IDL.Text,
  });
  const SetVisibleAttributesResponse = IDL.Variant({
    'Success' : IDL.Null,
    'ApplicationNotRegistered' : IDL.Null,
  });
  const VisibleAttributesArgs = IDL.Record({ 'app_domain_name' : IDL.Text });
  const VisibleAttributesSuccessResult = IDL.Record({
    'attributes' : IDL.Vec(AttributeId),
  });
  const VisibleAttributesResponse = IDL.Variant({
    'Success' : VisibleAttributesSuccessResult,
    'ApplicationNotRegistered' : IDL.Null,
  });
  return IDL.Service({
    'app_profile' : IDL.Func([AppProfileArgs], [AppProfileResponse], ['query']),
    'confirm_verification_code' : IDL.Func(
        [ConfirmVerificationCodeArgs],
        [ConfirmVerificationCodeResponse],
        [],
      ),
    'ext_remove_verification_codes' : IDL.Func(
        [RemoveVerificationCodesArgs],
        [RemoveVerificationCodesResponse],
        [],
      ),
    'ext_verification_codes' : IDL.Func(
        [VerificationCodesArgs],
        [VerificationCodesResponse],
        ['query'],
      ),
    'profile' : IDL.Func([ProfileArgs], [ProfileResponse], ['query']),
    'register_application' : IDL.Func(
        [RegisterApplicationArgs],
        [RegisterApplicationResponse],
        [],
      ),
    'register_attribute' : IDL.Func(
        [RegisterAttributeArgs],
        [RegisterAttributeResponse],
        [],
      ),
    'remove_attribute' : IDL.Func(
        [RemoveAttributeArgs],
        [RemoveAttributeResponse],
        [],
      ),
    'send_verification_code' : IDL.Func(
        [SendVerificationCodeArgs],
        [SendVerificationCodeResponse],
        [],
      ),
    'set_visible_attributes' : IDL.Func(
        [SetVisibleAttributesArgs],
        [SetVisibleAttributesResponse],
        [],
      ),
    'visible_attributes' : IDL.Func(
        [VisibleAttributesArgs],
        [VisibleAttributesResponse],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'verification_code_sender_principals' : IDL.Vec(IDL.Principal),
  });
  return [InitArgs];
};
