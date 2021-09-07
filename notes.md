1. OpenChat opens privIC in iframe
2. OpenChat sends privIC a sign-in message including any attribute requirements
3. privIC signs-in with II
4. privIC frontend calls backend to get user profile and any visible attributes for OpenChat
4.1 If the application is not registered then call to register it
4.2 If the application requirements are not met then prompt user for missing attributes
4.3 If/once the application requirements are met then send a message to OpenChat with the delegation which will close the privIC iframe

* privIC can derive a principal for the app from the user's II principal + app_domain_name

// Manual TEST steps

// Initial build/install privIC identity canister
dfx deploy identity --argument '(record { verification_code_sender_principals = vec { principal "tu45y-p4p3d-b4gg4-gmyy3-rgweo-whsrq-fephi-vshrn-cipca-xdkri-pae" } })'

// Re-install privIC identity canister
dfx canister install identity --mode=reinstall --argument '(record { verification_code_sender_principals = vec { principal "tu45y-p4p3d-b4gg4-gmyy3-rgweo-whsrq-fephi-vshrn-cipca-xdkri-pae" } })'

// Try to get the user's profile (NotFound expected)
dfx canister call identity profile '(record {})'

// Register an email address
dfx canister call identity register_attribute '(record { value = variant { Email = "megrogan@gmail.com"} })'

// Register a phone number
dfx canister call identity register_attribute '(record { value = variant { Phone = record { country_code = 44; number = "07778588510" }} })'

// Get the outstanding verification codes
dfx canister call identity ext_verification_codes '(record {from_index = 0 })'

// Confirm the phone number verification code
dfx canister call identity confirm_verification_code '(record {attribute_id = 74_437_986_170_390_037_583_193_656_216_585_700_068; verification_code = "006446" })'

// Register the application "open.chat"
dfx canister call identity register_application '(record { app_domain_name = "open.chat" })'

// Get the user's profile visible to openchat
dfx --identity=openchat canister call identity app_profile '(record {})'

// Set the user's email as visible to openchat
dfx canister call identity set_visible_attributes  '(record { app_domain_name = "open.chat"; attributes = vec {130_484_264_696_462_419_966_595_822_519_662_664_456}})'

// Get the user's visible attributes for openchat
dfx canister call identity visible_attributes '(record { app_domain_name = "open.chat"})'
