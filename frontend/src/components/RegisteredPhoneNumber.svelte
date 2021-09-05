<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    import type { PhoneNumber, Verifiable } from "../domain/identity/identity";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;
    export let phoneNumber: Verifiable<PhoneNumber>;
    export let visibility: boolean | undefined = undefined;

    let busy: boolean = false;
    let sendingCode: boolean = false;
    let confirmingCode: boolean = false;
    let codeValue: string = "";

    function sendVerificationCode() {
        sendingCode = busy = true;
        serviceContainer
            .sendVerificationCode(phoneNumber.id)
            .then((resp) => {
                if (resp === "success") {
                    phoneNumber.status = "sent";
                }
            })
            .finally(() => (sendingCode = busy = false));
        // todo deal with error handling
    }
    function submitOrResend() {
        confirmingCode = busy = true;
        serviceContainer
            .confirmVerificationCode(phoneNumber.id, codeValue)
            .then((resp) => {
                if (resp === "success") {
                    phoneNumber.status = "verified";
                }
            })
            .finally(() => (confirmingCode = busy = false));
        // todo deal with error handling
    }

    function unregister() {
        // todo - don't have an endpoint for this at the moment
        dispatch("unregistered", phoneNumber.id);
    }

    function grant() {
        dispatch("grant", phoneNumber.id);
    }

    function revoke() {
        dispatch("revoke", phoneNumber.id);
    }
</script>

<div class="phone-number">
    <div class="number">
        <span class="code">(+{phoneNumber.value.countryCode})</span>
        {phoneNumber.value.number}
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
        {#if phoneNumber.status === "pending"}
            <Button loading={sendingCode} disabled={busy} on:click={sendVerificationCode}
                >{sendingCode ? "Sending code" : "Verify"}</Button>
        {/if}
        {#if phoneNumber.status === "sent"}
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
        {#if phoneNumber.status === "verified"}
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
    :global(.phone-number button) {
        min-height: 40px;
        height: 40px;
        margin-right: $sp3;
        min-width: 120px;
        @include font(book, normal, fs-80);
    }

    :global(.phone-number .input-wrapper input) {
        min-height: 40px;
        height: 40px;
        margin-bottom: 0;
        border-radius: 0;
    }

    :global(.phone-number .input-wrapper) {
        margin-right: $sp3;
    }

    .phone-number {
        padding: $sp4;
        border-top: 1px solid #dddddd;

        &:first-child {
            border-top: none;
        }

        .code {
            margin-right: $sp3;
        }
    }

    .number {
        margin-bottom: $sp4;
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
