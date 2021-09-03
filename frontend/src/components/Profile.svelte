<script lang="ts">
    import { onMount } from "svelte";
    import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
    import {
        addPhoneNumber,
        removePhoneNumber,
        addEmailAddress,
        removeEmailAddress,
    } from "../domain/identity/identity";
    import type {
        PhoneNumber,
        Profile,
        Verifiable,
        ClientApp as ClientAppType,
    } from "../domain/identity/identity";

    import type { ServiceContainer } from "../services/serviceContainer";
    import HoverIcon from "./HoverIcon.svelte";
    import Loading from "./Loading.svelte";
    import NewPhoneNumber from "./NewPhoneNumber.svelte";
    import ClientApp from "./ClientApp.svelte";
    import NewEmailAddress from "./NewEmailAddress.svelte";
    import RegisteredPhoneNumber from "./RegisteredPhoneNumber.svelte";
    import RegisteredEmailAddress from "./RegisteredEmailAddress.svelte";

    export let serviceContainer: ServiceContainer;
    let profile: Profile;
    let addingPhoneNumber: boolean = false;
    let addingEmail: boolean = false;
    let selectedApp: ClientAppType | undefined = undefined;

    onMount(() => {
        serviceContainer.getProfile().then((p) => {
            profile = p;
        });
    });

    function registeredPhoneNumber(ev: CustomEvent<Verifiable<PhoneNumber>>) {
        profile = addPhoneNumber(profile, ev.detail);
        addingPhoneNumber = false;
    }

    function registeredEmailAddress(ev: CustomEvent<Verifiable<string>>) {
        profile = addEmailAddress(profile, ev.detail);
        addingEmail = false;
    }

    function unregisterPhone(ev: CustomEvent<bigint>) {
        profile = removePhoneNumber(profile, ev.detail);
    }

    function unregisterEmail(ev: CustomEvent<bigint>) {
        profile = removeEmailAddress(profile, ev.detail);
    }

    function selectApp(app: ClientAppType) {
        selectedApp = app;
    }
</script>

<main class="main">
    <h1 class="headline">Welcome to PrivIC</h1>

    <p class="blurb">
        All of your personal information in one place. You are in control of exactly which personal
        information your favourite dApps have access to. See at a glance who is using what and
        revoke access at any time.
    </p>

    <div class="profile">
        {#if profile === undefined}
            <Loading />
        {:else}
            {#if profile.apps.length > 0}
                <section class="section">
                    <div class="section-header">
                        <h5 class="section-title">Connected apps</h5>
                        <span class="section-subtitle"
                            >select a connected app to grant / revoke access</span>
                    </div>
                    <div class="section-body client-apps">
                        {#each profile.apps as app, i (app)}
                            <ClientApp
                                selected={selectedApp === app}
                                on:click={() => selectApp(app)}
                                {app} />
                        {/each}
                    </div>
                </section>
            {/if}
            <section class="section">
                <div class="section-header">
                    <h5 class="section-title">Phone numbers</h5>
                    <div class="icon" on:click={() => (addingPhoneNumber = true)}>
                        <HoverIcon>
                            <PlusCircleOutline size={"1.5em"} color={"hotpink"} />
                        </HoverIcon>
                    </div>
                </div>
                <div class="section-body">
                    {#if addingPhoneNumber}
                        <NewPhoneNumber
                            on:registeredPhoneNumber={registeredPhoneNumber}
                            {serviceContainer} />
                    {/if}
                    {#if profile.identity.phone.numbers.length === 0 && !addingPhoneNumber}
                        <p class="advice">Click the button above to register a new phone number</p>
                    {:else}
                        {#each profile.identity.phone.numbers as phoneNumber, i (phoneNumber)}
                            <RegisteredPhoneNumber
                                on:unregistered={unregisterPhone}
                                {phoneNumber}
                                {serviceContainer} />
                        {/each}
                    {/if}
                </div>
            </section>
            <section class="section">
                <div class="section-header">
                    <h5 class="section-title">Email addresses</h5>
                    <div class="icon" on:click={() => (addingEmail = true)}>
                        <HoverIcon>
                            <PlusCircleOutline size={"1.5em"} color={"hotpink"} />
                        </HoverIcon>
                    </div>
                </div>
                <div class="section-body">
                    {#if addingEmail}
                        <NewEmailAddress
                            on:registeredEmailAddress={registeredEmailAddress}
                            {serviceContainer} />
                    {/if}
                    {#if profile.identity.email.addresses.length === 0 && !addingEmail}
                        <p class="advice">Click the button above to register a new email address</p>
                    {:else}
                        {#each profile.identity.email.addresses as emailAddress, i (emailAddress)}
                            <RegisteredEmailAddress
                                on:unregistered={unregisterEmail}
                                {emailAddress}
                                {serviceContainer} />
                        {/each}
                    {/if}
                </div>
            </section>
        {/if}
    </div>
</main>

<style type="text/scss">
    .main {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        padding: 20px 50px 50px 50px;
        @include fullHeight();
        margin: auto;
        background-color: #efefef;
        overflow: auto;

        @include size-below(xs) {
            padding: 20px 20px;
        }
    }

    .profile {
        padding: $sp4;
        background-color: #ffffff;
        @include box-shadow(1);
        height: 100%;
        border-radius: $sp4;
    }

    .headline {
        @include font(bold, normal, fs-220);
        margin-bottom: $sp5;
    }

    .blurb {
        margin-bottom: $sp4;
        @include font(light, normal, fs-90);
    }

    .advice {
        padding: $sp4;
        @include font(light, normal, fs-90);
    }

    .section {
        @include box-shadow(1);
        background-color: #efefef;
        border-radius: $sp3;
        margin-bottom: $sp4;

        .section-header {
            display: flex;
            align-items: center;
            padding: $sp2;
            border-bottom: 1px solid #dddddd;

            .section-title {
                flex: auto;
                padding: $sp3;
            }

            .section-subtitle {
                @include font(light, italic, fs-80);
                padding: $sp3;
            }
            .icon {
                flex: 0 0 20px;
            }
        }

        .client-apps {
            padding: $sp4;
        }
    }
</style>
