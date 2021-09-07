<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Select from "./Select.svelte";
    import { createEventDispatcher } from "svelte";
    import { allCountries } from "country-telephone-data";
    import type { ServiceContainer } from "../services/serviceContainer";
    const dispatch = createEventDispatcher();
    export let error: string | undefined = undefined;
    export let serviceContainer: ServiceContainer;

    let phoneNumberStr: string = "";
    let countryCodeStr: string = "0";
    let registering: boolean = false;

    function registerPhoneNumber(e: Event) {
        e.preventDefault();
        registering = true;
        serviceContainer
            .registerPhoneNumber({ countryCode, number: phoneNumber })
            .then((resp) => {
                if (resp.kind === "register_attribute_success") {
                    dispatch("registeredPhoneNumber", {
                        id: resp.id,
                        status: "pending",
                        added: BigInt(+new Date()),
                        value: { countryCode, number: phoneNumber },
                    });
                } else {
                    console.log("todo - handle errors");
                }
            })
            .finally(() => (registering = false));
    }

    $: phoneNumber = phoneNumberStr.replace(/\D/g, "");
    $: countryCode = parseInt(countryCodeStr, 10);
    $: valid = !isNaN(parseInt(phoneNumber, 10)) && !isNaN(countryCode) && countryCode !== 0;
</script>

<div class="phone-number">
    <div class="country">
        <Select invalid={error !== undefined} bind:value={countryCodeStr}>
            <option disabled={true} selected value="0">Country code</option>
            {#each allCountries as country}
                <option value={country.dialCode}>(+{country.dialCode}) {country.name}</option>
            {/each}
        </Select>
    </div>
    <form class="number" on:submit|preventDefault={registerPhoneNumber}>
        <Input
            invalid={error !== undefined}
            autofocus={true}
            bind:value={phoneNumberStr}
            minlength={3}
            maxlength={25}
            placeholder="Phone number" />
    </form>
    <div class="actions">
        <Button loading={registering} disabled={!valid} on:click={registerPhoneNumber}
            >Register</Button>
    </div>
</div>

<style type="text/scss">
    :global(.phone-number button) {
        min-height: 40px;
        height: 40px;
    }

    .phone-number {
        padding: $sp4;
        display: flex;
        .country {
            flex: 2;
            margin-right: $sp3;
        }
        .number {
            flex: 4;
            margin-right: $sp3;
        }

        .actions {
            flex: 0 0 100px;
        }
    }
</style>
