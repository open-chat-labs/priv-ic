# PrivIC Chat Frontend

This is the frontend codebase for PrivIC. It is a svelte app written in typescript.

To run locally you will need to do the following:

## Install dependencies

`npm i`

## Start a local IC replica

Make sure that you have a locally running IC replica. The recommended approach is to clone the [internet identity repo](https://github.com/dfinity/internet-identity) then cd into that directory and run `dfx start`.

In a separate terminal in the same directory, run `II_ENV=development dfx deploy --no-wallet --argument '(null)'`

Make a note of the canister ID created for the internet-identity.

## Local environment variables

`cd` back into the frontend directory of this repo and create a .env file.

This should look something like this:

```bash
INTERNET_IDENTITY_URL=http://localhost:8000?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai
DFX_NETWORK=local
MOCK_SERVICES=false
```

Where the INTERNET_IDENTITY value should be replaced with a value containing the correct internet identity canister ID for your local environment.

## Build and deploy server canisters

The frontend depends on both the generated types of the back end services and also requires instances of the relevant canisters to be deployed to the local IC replica.

## Start the dev server

From the frontend directory, run `npm run dev` to start the rollup dev server. The system should now be available on `http://localhost:5000`.

## Building

To create a production build run `npm run build`.
