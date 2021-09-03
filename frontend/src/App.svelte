<script lang="ts">
    import { onMount } from "svelte";

    // import Login from "./components/Login.svelte";
    // const Register = () => import("./components/register/Register.controller.svelte");
    // import Upgrading from "./components/upgrading/Upgrading.svelte";
    // import Loading from "./components/Loading.svelte";
    // import UnexpectedError from "./components/unexpectedError/UnexpectedError.svelte";
    // import SessionExpired from "./components/sessionExpired/SessionExpired.svelte";
    // import Lazy from "./components/Lazy.svelte";

    onMount(() => {
        calculateHeight();
    });

    function calculateHeight() {
        // fix the issue with 100vh layouts in various mobile browsers
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
</script>

<h1>Yo hello from svelte</h1>

<!-- {#if $state.matches("login") || $state.matches("logging_in")}
    <Login loading={$state.matches("logging_in")} on:login={() => send({ type: "LOGIN" })} />
{:else if $state.matches("register_user") && regMachine}
    <Lazy component={Register} machine={regMachine} />
{:else if $state.matches("logged_in")}
    <Router {routes} />
{:else if $state.matches("unexpected_error")}
    <UnexpectedError error={$state.context.error} />
{:else if $state.matches("expired")}
    <SessionExpired on:login={() => send({ type: "ACKNOWLEDGE_EXPIRY" })} />
{:else if $state.matches("upgrading_user") || $state.matches("upgrade_user")}
    <Upgrading />
{:else}
    <Loading />
{/if} -->

<svelte:window on:resize={calculateHeight} />
