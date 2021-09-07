<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import { createEventDispatcher } from "svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    import { registerAttributeErrorString } from "../domain/identity/identity";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;

    let emailAddress: string = "";
    let registering: boolean = false;

    function registerEmailAddress(e: Event) {
        e.preventDefault();
        registering = true;
        error = undefined;
        serviceContainer
            .registerEmailAddress(emailAddress)
            .then((resp) => {
                if (resp.kind === "register_attribute_success") {
                    dispatch("registeredEmailAddress", {
                        id: resp.id,
                        status: "sent",
                        added: BigInt(+new Date()),
                        value: emailAddress,
                    });
                } else {
                    error = registerAttributeErrorString(resp);
                }
            })
            .finally(() => (registering = false));
    }

    // todo - we can probably come up with some sort of regex to validate this (but not properly)
    $: valid = emailAddress.length > 0;
</script>

<div class="email-address">
    <form class="address" on:submit|preventDefault={registerEmailAddress}>
        <Input
            invalid={error !== undefined}
            autofocus={true}
            bind:value={emailAddress}
            minlength={3}
            maxlength={100}
            placeholder="Email address" />
    </form>
    <div class="actions">
        <Button loading={registering} disabled={!valid} on:click={registerEmailAddress}
            >Register</Button>
    </div>
</div>
{#if error !== undefined}
    <div class="error">
        {error}
    </div>
{/if}

<style type="text/scss">
    :global(.email-address button) {
        min-height: 40px;
        height: 40px;
    }

    .email-address {
        padding: $sp4;
        display: flex;
        .address {
            flex: auto;
            margin-right: $sp3;
        }

        .actions {
            flex: 0 0 100px;
        }
    }
    .error {
        padding: $sp3;
        color: darkred;
        @include font(light, normal, fs-100);
    }
</style>
