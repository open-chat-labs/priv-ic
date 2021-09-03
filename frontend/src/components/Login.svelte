<script lang="ts">
    import Button from "./Button.svelte";
    import { createEventDispatcher } from "svelte";
    import ModalPage from "./ModalPage.svelte";
    const dispatch = createEventDispatcher();
    export let loading: boolean = false;
</script>

<ModalPage>
    <h4 class="subtitle">Sign in required ...</h4>
    <h1 class="title">Login to PrivIC</h1>
    <p class="blurb">
        In order to use the PrivIC service you must first authenticate with the Internet Identity
        service
    </p>
    <Button disabled={loading} {loading} on:click={() => dispatch("login")}>Login</Button>
</ModalPage>

<style type="text/scss">
    .subtitle {
        @include font(bold, normal, fs-140);
        margin-bottom: $sp5;
    }

    .title {
        @include font(bold, normal, fs-220);
        margin: $sp5 0;
    }
    .blurb {
        text-align: center;
        margin-bottom: $sp5;
        @include font(light, italic, fs-100);
    }
</style>
