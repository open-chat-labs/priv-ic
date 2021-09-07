<script lang="ts">
    import { onMount } from "svelte";
    import Loading from "./components/Loading.svelte";
    import Login from "./components/Login.svelte";
    import Profile from "./components/Profile.svelte";
    import type { DataRequest, DataRequirement } from "./domain/requirements/requirements";
    import { extractDataRequest } from "./domain/requirements/requirements";
    import { getIdentity, login, returnToClient } from "./services/auth";
    import { ServiceContainer } from "./services/serviceContainer";

    let loginRequired: boolean = false;
    let loginInProgress: boolean = false;
    let serviceContainer: ServiceContainer | undefined = undefined;
    let dataRequest: DataRequest | undefined = undefined;

    onMount(() => {
        // if we have #authorize in the hash fragment and we are not signed in, go straight to
        // II
        if (window.location.hash === "#authorize") {
            dataRequest = extractDataRequest();
            startLogin();
            loginRequired = true;
            return;
        }
        getIdentity().then((id) => {
            if (id.getPrincipal().isAnonymous()) {
                loginRequired = true;
            } else {
                serviceContainer = new ServiceContainer(id);
            }
        });
        calculateHeight();
    });

    function calculateHeight() {
        // fix the issue with 100vh layouts in various mobile browsers
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    function getServiceContainer(): ServiceContainer {
        return serviceContainer!;
    }

    function startLogin() {
        loginInProgress = true;
        login().then((id) => {
            loginInProgress = loginRequired = false;
            serviceContainer = new ServiceContainer(id);
        });
    }
</script>

{#if loginRequired}
    <Login loading={loginInProgress} on:login={() => startLogin()} />
{:else if serviceContainer !== undefined}
    <Profile {dataRequest} serviceContainer={getServiceContainer()} />
{:else}
    <Loading />
{/if}

<svelte:window on:resize={calculateHeight} />

<style type="text/scss">
    :global(body) {
        background-color: #000000;
    }
</style>
