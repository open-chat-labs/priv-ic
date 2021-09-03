<script lang="ts">
    import { onMount } from "svelte";
    import { getIdentity, login } from "./services/auth";

    onMount(() => {
        calculateHeight();
        getIdentity().then((id) => {
            if (id.getPrincipal().isAnonymous()) {
                login().then((id) => {
                    console.log("we are signed in: ", id);
                });
            }
        });
    });

    function calculateHeight() {
        // fix the issue with 100vh layouts in various mobile browsers
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
</script>

<h1>Yo hello from svelte</h1>

<svelte:window on:resize={calculateHeight} />
