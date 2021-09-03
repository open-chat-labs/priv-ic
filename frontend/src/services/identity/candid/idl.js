export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'verification_code_sender_principals' : IDL.Vec(IDL.Principal),
  });
  const AppProfileViewArgs = IDL.Record({});
  const AppEmailAddress = IDL.Record({
    'verified' : IDL.Bool,
    'value' : IDL.Text,
  });
  const AppEmailFacet = IDL.Record({
    'any_verified' : IDL.Bool,
    'addresses' : IDL.Vec(AppEmailAddress),
  });
  const AppPhoneNumber = IDL.Record({
    'verified' : IDL.Bool,
    'value' : IDL.Text,
  });
  const AppPhoneFacet = IDL.Record({
    'any_verified' : IDL.Bool,
    'numbers' : IDL.Vec(AppPhoneNumber),
  });
  const AppProfileViewSuccessResult = IDL.Record({
    'email' : AppEmailFacet,
    'phone' : AppPhoneFacet,
  });
  const AppProfileViewResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'Success' : AppProfileViewSuccessResult,
  });
  const FieldId = IDL.Nat;
  const ConfirmVerificationCodeArgs = IDL.Record({
    'verification_code' : IDL.Text,
    'field_id' : FieldId,
  });
  const ConfirmVerificationCodeResponse = IDL.Variant({
    'NotSent' : IDL.Null,
    'AlreadyConfirmed' : IDL.Null,
    'NotFound' : IDL.Null,
    'Success' : IDL.Null,
    'ConfirmationCodeExpired' : IDL.Null,
    'ConfirmationCodeIncorrect' : IDL.Null,
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
    'index' : IDL.Nat64,
  });
  const VerificationCodesSuccessResult = IDL.Record({
    'verification_codes' : IDL.Vec(VerificationCode),
  });
  const VerificationCodesResponse = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Success' : VerificationCodesSuccessResult,
  });
  const ProfileArgs = IDL.Record({});
  const App = IDL.Record({ 'domain_name' : IDL.Text });
  const TimestampMillis = IDL.Nat64;
  const VerificationCodeSentState = IDL.Record({
    'code' : IDL.Text,
    'date' : TimestampMillis,
  });
  const VerificationCodeVerifiedState = IDL.Record({
    'date' : TimestampMillis,
  });
  const VerificationCodeStatus = IDL.Variant({
    'Sent' : VerificationCodeSentState,
    'Verified' : VerificationCodeVerifiedState,
    'Pending' : IDL.Null,
  });
  const VerifiableEmailAddress = IDL.Record({
    'id' : FieldId,
    'status' : VerificationCodeStatus,
    'added' : TimestampMillis,
    'value' : IDL.Text,
  });
  const EmailFacet = IDL.Record({
    'addresses' : IDL.Vec(VerifiableEmailAddress),
  });
  const PhoneNumber = IDL.Record({
    'country_code' : IDL.Nat16,
    'number' : IDL.Text,
  });
  const VerifiablePhoneNumber = IDL.Record({
    'id' : FieldId,
    'status' : VerificationCodeStatus,
    'added' : TimestampMillis,
    'value' : PhoneNumber,
  });
  const PhoneFacet = IDL.Record({ 'numbers' : IDL.Vec(VerifiablePhoneNumber) });
  const Identity = IDL.Record({ 'email' : EmailFacet, 'phone' : PhoneFacet });
  const ProfileSuccessResult = IDL.Record({
    'apps' : IDL.Vec(App),
    'identity' : Identity,
  });
  const ProfileResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'Success' : ProfileSuccessResult,
  });
  const RegisterEmailArgs = IDL.Record({ 'email_address' : IDL.Text });
  const RegisterEmailAddressSuccessResult = IDL.Record({
    'field_id' : FieldId,
  });
  const RegisterEmailResponse = IDL.Variant({
    'AlreadyRegistered' : IDL.Null,
    'Success' : RegisterEmailAddressSuccessResult,
    'InvalidEmailAddress' : IDL.Null,
  });
  const RegisterPhoneNumberArgs = IDL.Record({ 'phone_number' : PhoneNumber });
  const RegisterPhoneNumberSuccessResult = IDL.Record({ 'field_id' : FieldId });
  const RegisterPhoneNumberResponse = IDL.Variant({
    'AlreadyRegistered' : IDL.Null,
    'Success' : RegisterPhoneNumberSuccessResult,
    'InvalidPhoneNumber' : IDL.Null,
  });
  const SendVerificationCodeArgs = IDL.Record({ 'field_id' : FieldId });
  const SendVerificationCodeResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'Success' : IDL.Null,
    'AlreadySent' : IDL.Null,
  });
  const SetVisibleProfileFieldsArgs = IDL.Record({
    'fields' : IDL.Vec(FieldId),
    'app_domain_name' : IDL.Text,
  });
  const SetVisibleProfileFieldsResponse = IDL.Variant({});
  const VisibleProfileFieldsArgs = IDL.Record({ 'app_domain_name' : IDL.Text });
  const VisibleProfileFieldsSuccessResult = IDL.Record({
    'fields' : IDL.Vec(FieldId),
  });
  const VisibleProfileFieldsResponse = IDL.Variant({
    'NotFound' : IDL.Null,
    'Success' : VisibleProfileFieldsSuccessResult,
  });
  return IDL.Service({
    'app_profile_view' : IDL.Func(
        [AppProfileViewArgs],
        [AppProfileViewResponse],
        ['query'],
      ),
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
        [],
      ),
    'profile' : IDL.Func([ProfileArgs], [ProfileResponse], ['query']),
    'register_email' : IDL.Func(
        [RegisterEmailArgs],
        [RegisterEmailResponse],
        [],
      ),
    'register_phone_number' : IDL.Func(
        [RegisterPhoneNumberArgs],
        [RegisterPhoneNumberResponse],
        [],
      ),
    'send_verification_code' : IDL.Func(
        [SendVerificationCodeArgs],
        [SendVerificationCodeResponse],
        [],
      ),
    'set_visible_profile_fields' : IDL.Func(
        [SetVisibleProfileFieldsArgs],
        [SetVisibleProfileFieldsResponse],
        [],
      ),
    'visible_profile_fields' : IDL.Func(
        [VisibleProfileFieldsArgs],
        [VisibleProfileFieldsResponse],
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
