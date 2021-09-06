<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    import type { Verifiable } from "../domain/identity/identity";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;
    export let emailAddress: Verifiable<string>;
    export let visibility: boolean | undefined = undefined;

    let busy: boolean = false;
    let sendingCode: boolean = false;
    let confirmingCode: boolean = false;
    let codeValue: string = "";

    // todo - there's a fair bit of duplication here that would be nice to remove
    function sendVerificationCode() {
        sendingCode = busy = true;
        serviceContainer
            .sendVerificationCode(emailAddress.id)
            .then((resp) => {
                if (resp === "success") {
                    dispatch("codeSent", emailAddress);
                    emailAddress.status = "sent";
                }
            })
            .finally(() => (sendingCode = busy = false));
        // todo deal with error handling
    }
    function submitOrResend() {
        confirmingCode = busy = true;
        serviceContainer
            .confirmVerificationCode(emailAddress.id, codeValue)
            .then((resp) => {
                if (resp === "success") {
                    dispatch("codeVerified", emailAddress);
                    emailAddress.status = "verified";
                }
            })
            .finally(() => (confirmingCode = busy = false));
        // todo deal with error handling
    }

    function unregister() {
        // todo - don't have an endpoint for this at the moment
        dispatch("unregistered", emailAddress.id);
    }

    function grant() {
        dispatch("grant", emailAddress.id);
    }

    function revoke() {
        dispatch("revoke", emailAddress.id);
    }
</script>

<div class="email-address">
    <div class="address">
        {emailAddress.value}
    </div>
    <div class="actions">
        {#if visibility !== undefined}
            <span transition:fade>
                {#if visibility}
                    <Button on:click={revoke} bad={true}>Revoke</Button>
                {:else}
                    <Button on:click={grant} good={true}>Grant</Button>
                {/if}
            </span>
        {/if}
        {#if emailAddress.status === "pending"}
            <Button
                small={true}
                loading={sendingCode}
                disabled={busy}
                on:click={sendVerificationCode}>{sendingCode ? "Sending code" : "Verify"}</Button>
        {/if}
        {#if emailAddress.status === "sent"}
            <Input
                invalid={error !== undefined}
                align="center"
                autofocus={true}
                bind:value={codeValue}
                minlength={6}
                maxlength={6}
                disabled={confirmingCode}
                placeholder={"Enter code"} />
            <Button loading={confirmingCode} disabled={busy} on:click={submitOrResend}
                >{codeValue.length === 6 ? "Submit code" : "Re-send code"}</Button>
        {/if}
        {#if emailAddress.status === "verified"}
            <!-- todo - this is not really a button -->
            <Button disabled={busy}>Verified</Button>
        {/if}
        <Button on:click={unregister} disabled={busy} secondary={true}>Delete</Button>
        <!-- todo if we are filtering by an app, we will want a revoke button
        <Button>Revoke access</Button>
        -->
    </div>
</div>

<style type="text/scss">
    :global(.email-address button) {
        min-height: 40px;
        height: 40px;
        margin-right: $sp3;
        min-width: 120px;
        @include font(book, normal, fs-80);
    }

    :global(.email-address .input-wrapper input) {
        min-height: 40px;
        height: 40px;
        margin-bottom: 0;
        border-radius: 0;
    }

    :global(.email-address .input-wrapper) {
        margin-right: $sp3;
    }

    .email-address {
        padding: $sp4;
        border-top: 1px solid #dddddd;

        &:first-child {
            border-top: none;
        }
    }

    .address {
        margin-bottom: $sp4;
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
