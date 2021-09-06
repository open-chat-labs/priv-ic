1. OpenChat opens privIC in iframe
2. OpenChat sends privIC a sign-in message including any attribute requirements
3. privIC signs-in with II
4. privIC frontend calls backend to get user profile and any visible attributes for OpenChat
4.1 If the application is not registered then call to register it
4.2 If the application requirements are not met then prompt user for missing attributes
4.3 If/once the application requirements are met then send a message to OpenChat with the delegation which will close the privIC iframe

* privIC can derive a principal for the app from the user's II principal + app_domain_name
