<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import TrashCanOutline from "svelte-material-icons/TrashCanOutline.svelte";
    import CheckCircleOutline from "svelte-material-icons/CheckCircleOutline.svelte";
    import SendCircleOutline from "svelte-material-icons/SendCircleOutline.svelte";
    import Refresh from "svelte-material-icons/Refresh.svelte";
    import HoverIcon from "./HoverIcon.svelte";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    import { confirmCodeErrorString } from "../domain/identity/identity";
    import type { Verifiable } from "../domain/identity/identity";
    import Link from "./Link.svelte";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;
    export let attribute: Verifiable<unknown>;
    export let visibility: boolean | undefined = undefined;

    let busy: boolean = false;
    let sendingCode: boolean = false;
    let resendingCode: boolean = false;
    let confirmingCode: boolean = false;
    let codeValue: string = "";

    function sendVerificationCode() {
        error = undefined;
        sendingCode = busy = true;
        serviceContainer
            .sendVerificationCode(attribute.id)
            .then((resp) => {
                if (resp === "success") {
                    dispatch("codeSent", attribute);
                    attribute.status = "sent";
                }
            })
            .finally(() => (sendingCode = busy = false));
        // todo deal with error handling
    }

    function resend() {
        resendingCode = busy = true;
        setTimeout(() => {
            console.log("TODO - this doesn't do anything yet");
            resendingCode = busy = false;
        }, 1000);
    }

    function submitCode() {
        error = undefined;
        confirmingCode = busy = true;
        serviceContainer
            .confirmVerificationCode(attribute.id, codeValue)
            .then((resp) => {
                if (resp === "success") {
                    dispatch("codeVerified", attribute);
                    attribute.status = "verified";
                } else if (resp === "code_incorrect") {
                    error = confirmCodeErrorString(resp);
                }
            })
            .finally(() => (confirmingCode = busy = false));
        // todo deal with error handling
    }

    function unregister() {
        dispatch("unregistered", attribute.id);
    }

    function grant() {
        dispatch("grant", attribute.id);
    }

    function revoke() {
        dispatch("revoke", attribute.id);
    }
</script>

<div class="attribute">
    <div class="attribute-row">
        <div class="unregister" on:click={unregister}>
            <HoverIcon>
                <TrashCanOutline size={"1.5em"} color={"hotpink"} />
            </HoverIcon>
        </div>
        <span class="attribute-value">
            <slot value={attribute.value} />

            {#if visibility !== undefined}
                <span class="access" transition:fade>
                    {#if visibility}
                        <Link on:click={revoke} underline="always">Revoke</Link>
                    {:else}
                        <Link on:click={grant} underline="always">Grant</Link>
                    {/if}
                </span>
            {/if}
        </span>
        {#if attribute.status === "verified"}
            <span class="verified" title="Verified attribute">
                <CheckCircleOutline size={"1.5em"} color={"seagreen"} />
            </span>
        {:else if attribute.status === "pending"}
            <span class="pending">
                <Button
                    small={true}
                    loading={sendingCode}
                    disabled={busy}
                    on:click={sendVerificationCode}>Verify</Button>
            </span>
        {/if}
    </div>
    <div class="actions">
        {#if attribute.status === "sent"}
            <form on:submit|preventDefault={submitCode}>
                <Input
                    align="center"
                    autofocus={true}
                    bind:value={codeValue}
                    minlength={4}
                    maxlength={4}
                    disabled={confirmingCode}
                    placeholder={"Enter code"} />
            </form>
            <div class="send" class:spin={confirmingCode} title="submit code" on:click={submitCode}>
                <HoverIcon>
                    <SendCircleOutline size={"1.5em"} color={"#999"} />
                </HoverIcon>
            </div>
            <div class="resend" title="re-send code" on:click={resend} class:spin={resendingCode}>
                <HoverIcon>
                    <Refresh size={"1.5em"} color={"#999"} />
                </HoverIcon>
            </div>
        {/if}
    </div>
    {#if error !== undefined}
        <div class="error">
            {error}
        </div>
    {/if}
</div>

<style type="text/scss">
    :global(.attribute button) {
        min-height: 40px;
        height: 40px;
        margin-right: $sp3;
        min-width: 120px;
        @include font(book, normal, fs-80);
    }

    :global(.attribute .input-wrapper input) {
        min-height: 40px;
        height: 40px;
        margin-bottom: 0;
        border-radius: 0;
    }

    :global(.attribute .pending button) {
        min-width: none;
    }

    :global(.attribute-row .input-wrapper) {
        margin-right: $sp3;
    }

    .attribute {
        padding: $sp4 0;
        border-top: 1px solid #dddddd;

        &:first-child {
            border-top: none;
        }
    }

    .attribute-row {
        margin-bottom: $sp4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .unregister {
            flex: 0 0 20px;
            margin-right: 10px;
        }

        .attribute-value {
            flex: 1;
        }

        .verified {
            flex: 0 0 20px;
            margin-right: $sp4;
        }

        .pending {
            flex: 0 0 120px;
        }
    }

    .actions {
        display: flex;
        justify-content: flex-start;
        padding: 0 $sp3;
        flex-wrap: wrap;
        > * {
            margin-bottom: $sp3;
        }
    }

    .access {
        @include font(light, normal, fs-90);
        margin-left: $sp4;
    }

    .spin {
        @include spin();
    }

    .error {
        padding: $sp3;
        color: darkred;
        @include font(light, normal, fs-100);
    }
</style>
