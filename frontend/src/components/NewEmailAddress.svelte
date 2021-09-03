<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import { createEventDispatcher } from "svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;

    let emailAddress: string = "";
    let registering: boolean = false;

    function registerEmailAddress(e: Event) {
        e.preventDefault();
        registering = true;
        serviceContainer
            .registerEmailAddress(emailAddress)
            .then((resp) => {
                if (resp.kind === "register_email_success") {
                    dispatch("registeredEmailAddress", {
                        id: resp.id,
                        status: "pending",
                        added: BigInt(+new Date()),
                        value: emailAddress,
                    });
                } else {
                    console.log("todo - handle errors");
                }
            })
            .finally(() => (registering = false));
    }

    // todo - we can probably come up with some sort of regex to validate this (but not properly)
    $: valid = emailAddress.length > 0;
</script>

<div class="email-address">
    <div class="address">
        <Input
            invalid={error !== undefined}
            autofocus={true}
            bind:value={emailAddress}
            minlength={3}
            maxlength={100}
            placeholder="Email address" />
    </div>
    <div class="actions">
        <Button loading={registering} disabled={!valid} on:click={registerEmailAddress}
            >Register</Button>
    </div>
</div>

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
</style>
