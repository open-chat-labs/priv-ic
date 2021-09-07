<script lang="ts">
    import Button from "./Button.svelte";
    import { createEventDispatcher } from "svelte";
    import ModalPage from "./ModalPage.svelte";
    const dispatch = createEventDispatcher();
    export let loading: boolean = false;
</script>

<ModalPage bgClass="underwater">
    <h4 class="subtitle">Login required ...</h4>
    <h1 class="title">{loading ? "Logging in to PrivIC" : "Login to PrivIC"}</h1>
    <p class="blurb">
        You personal information in one place and under <strong>your</strong> control. Share only what
        you choose to with your favourite dApps.
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
        text-shadow: 1px 1px rgba(255, 255, 255, 0.2);
        margin: $sp5 0;
    }
    .blurb {
        text-align: center;
        margin-bottom: $sp5;
        @include font(light, italic, fs-100);
    }
</style>
