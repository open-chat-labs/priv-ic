rm ./src/services/identity/candid/types.ts
rm ./src/services/identity/candid/idl.js
didc bind ../backend/canisters/identity/api/can.did -t ts >> ./src/services/identity/candid/types.ts
didc bind ../backend/canisters/identity/api/can.did -t js >> ./src/services/identity/candid/idl.js
