<script lang="ts">
    import { onMount } from "svelte";
    import Login from "./components/Login.svelte";
    import { getIdentity, login } from "./services/auth";

    let loginRequired: boolean = false;
    let loginInProgress: boolean = false;

    onMount(() => {
        getIdentity().then((id) => {
            if (id.getPrincipal().isAnonymous()) {
                loginRequired = true;
            } else {
                console.log("we are signed in: ", id);
            }
        });
        calculateHeight();
    });

    function calculateHeight() {
        // fix the issue with 100vh layouts in various mobile browsers
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    function startLogin() {
        loginInProgress = true;
        login().then((id) => {
            loginInProgress = loginRequired = false;
            console.log("we are signed in: ", id);
        });
    }
</script>

{#if loginRequired}
    <Login loading={loginInProgress} on:login={startLogin} />
{:else}
    <main class="main">
        <h1>We are signed in</h1>
    </main>
{/if}

<svelte:window on:resize={calculateHeight} />

<style type="text/scss">
    :global(body) {
        background-color: #000000;
    }

    .main {
        max-width: 800px;
        padding: 50px;
        @include fullHeight();
        margin: auto;
        background-color: #ffffff;
    }
</style>
