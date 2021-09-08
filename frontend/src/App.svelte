<script lang="ts">
    import { onMount } from "svelte";
    import Loading from "./components/Loading.svelte";
    import Login from "./components/Login.svelte";
    import Profile from "./components/Profile.svelte";
    import { getIdentity, login, logout } from "./services/auth";
    import { ServiceContainer } from "./services/serviceContainer";
    import type { DataRequestWithOrigin } from "./utils/authClient";

    let loginRequired: boolean = false;
    let loginInProgress: boolean = false;
    let serviceContainer: ServiceContainer | undefined = undefined;
    let dataRequest: DataRequestWithOrigin | undefined = undefined;

    onMount(() => {
        // if we have #authorize in the hash fragment and we are not signed in, go straight to
        // II
        if (window.location.hash === "#authorize") {
            console.log("about to login");
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
        login().then(([id, dataReq]) => {
            loginInProgress = loginRequired = false;
            dataRequest = dataReq;
            serviceContainer = new ServiceContainer(id);
        });
    }

    function performLogout() {
        logout().then(() => {
            loginRequired = true;
        });
    }
</script>

{#if loginRequired}
    <Login loading={loginInProgress} on:login={() => startLogin()} />
{:else if serviceContainer !== undefined}
    <Profile on:logout={performLogout} {dataRequest} serviceContainer={getServiceContainer()} />
{:else}
    <Loading />
{/if}

<svelte:window on:resize={calculateHeight} />

<style type="text/scss">
    :global(body) {
        background-color: #000000;
    }
</style>
