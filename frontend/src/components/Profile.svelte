<script lang="ts">
    import { onMount } from "svelte";
    import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
    import {
        addPhoneNumber,
        removePhoneNumber,
        addEmailAddress,
        removeEmailAddress,
        openchat,
        updatePhoneStatus,
        updateEmailStatus,
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
    import type { DataRequest } from "../domain/requirements/requirements";
    import { returnToClient } from "../services/auth";

    export let serviceContainer: ServiceContainer;
    export let dataRequest: DataRequest | undefined;
    let profile: Profile | undefined;
    let addingPhoneNumber: boolean = false;
    let addingEmail: boolean = false;
    let loadingAppProfile: boolean = false;
    let visibleAttributes: bigint[] = [];

    $: selectedApp = dataRequest ? { domainName: openchat } : undefined;

    $: {
        if (areRequirementsMet(profile)) {
            returnToClient();
        }
    }

    // todo - obviously this is nowhere near good enough for the general case
    function areRequirementsMet(profile: Profile | undefined): boolean {
        if (dataRequest === undefined) return true;
        if (profile === undefined) return false;

        let met = true;

        if (dataRequest.requirements.phone !== undefined) {
            met = met && profile.identity.phone.numbers.some((n) => n.status === "verified");
        }

        if (dataRequest.requirements.email !== undefined) {
            met = met && profile.identity.email.addresses.some((a) => a.status === "verified");
        }

        return met;
    }

    onMount(() => {
        serviceContainer.getProfile().then((p) => {
            profile = p;
        });
    });

    function registeredPhoneNumber(ev: CustomEvent<Verifiable<PhoneNumber>>) {
        if (!profile) return;
        profile = addPhoneNumber(profile, ev.detail);
        addingPhoneNumber = false;
    }

    function registeredEmailAddress(ev: CustomEvent<Verifiable<string>>) {
        if (!profile) return;
        profile = addEmailAddress(profile, ev.detail);
        addingEmail = false;
    }

    function unregisterPhone(ev: CustomEvent<bigint>) {
        if (!profile) return;
        serviceContainer.removeAttribute(ev.detail);
        profile = removePhoneNumber(profile, ev.detail);
    }

    function unregisterEmail(ev: CustomEvent<bigint>) {
        if (!profile) return;
        serviceContainer.removeAttribute(ev.detail);
        profile = removeEmailAddress(profile, ev.detail);
    }

    function phoneCodeSent(ev: CustomEvent<bigint>) {
        if (!profile) return;
        profile = updatePhoneStatus(profile, ev.detail, "sent");
    }

    function phoneCodeVerified(ev: CustomEvent<bigint>) {
        if (!profile) return;
        profile = updatePhoneStatus(profile, ev.detail, "verified");
    }

    function emailCodeSent(ev: CustomEvent<bigint>) {
        if (!profile) return;
        profile = updateEmailStatus(profile, ev.detail, "sent");
    }

    function emailCodeVerified(ev: CustomEvent<bigint>) {
        if (!profile) return;
        profile = updateEmailStatus(profile, ev.detail, "verified");
    }

    function toggleApp(app: ClientAppType) {
        selectedApp = app.domainName === selectedApp?.domainName ? undefined : app;
        if (selectedApp) {
            loadingAppProfile = true;
            serviceContainer
                .visibleProfileAttributes(app.domainName)
                .then((resp) => {
                    if (resp !== "application_not_registered") {
                        visibleAttributes = resp;
                    }
                })
                .finally(() => (loadingAppProfile = false));
        }
    }

    function grant(ev: CustomEvent<bigint>) {
        if (selectedApp) {
            const { domainName } = selectedApp;
            visibleAttributes = [ev.detail, ...visibleAttributes];
            serviceContainer.setVisibleProfileAttributes(domainName, visibleAttributes).then(() => {
                serviceContainer.visibleProfileAttributes(domainName).then((resp) => {
                    if (resp !== "application_not_registered") {
                        visibleAttributes = resp;
                    }
                });
            });
        }
    }

    function revoke(ev: CustomEvent<bigint>) {
        if (selectedApp) {
            const { domainName } = selectedApp;
            visibleAttributes = visibleAttributes.filter((attr) => attr !== ev.detail);
            serviceContainer.setVisibleProfileAttributes(domainName, visibleAttributes).then(() => {
                serviceContainer.visibleProfileAttributes(domainName).then((resp) => {
                    if (resp !== "application_not_registered") {
                        visibleAttributes = resp;
                    }
                });
            });
        }
    }
</script>

<div class="wrapper">
    <div class="left" />
    <main class="main">
        {#if dataRequest === undefined}
            <h1 class="headline">Welcome to PrivIC</h1>

            <p class="blurb">
                All of your personal information in one place. You are in control of exactly which
                personal information your favourite dApps have access to. See at a glance who is
                using what and revoke access at any time.
            </p>
        {/if}
        <div class="profile" class:loading={profile === undefined}>
            {#if profile === undefined}
                <Loading />
            {:else}
                {#if profile.apps.length > 0 && dataRequest === undefined}
                    <section class="section">
                        <div class="section-header">
                            <h5 class="section-title">Connected apps</h5>
                            <span class="section-subtitle"
                                >select a connected app to grant / revoke access</span>
                        </div>
                        <div class="section-body client-apps">
                            {#each profile.apps as app, i (app)}
                                <ClientApp
                                    loading={loadingAppProfile}
                                    selected={selectedApp?.domainName === app.domainName}
                                    on:click={() => toggleApp(app)}
                                    {app} />
                            {/each}
                        </div>
                    </section>
                {/if}
                {#if dataRequest === undefined || dataRequest?.requirements.phone !== undefined}
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
                                <p class="advice">
                                    Click the button above to register a new phone number
                                </p>
                            {:else}
                                {#each profile.identity.phone.numbers as phoneNumber, i (phoneNumber)}
                                    <RegisteredPhoneNumber
                                        on:grant={grant}
                                        on:revoke={revoke}
                                        on:codeSent={phoneCodeSent}
                                        on:codeVerified={phoneCodeVerified}
                                        visibility={selectedApp && !loadingAppProfile
                                            ? visibleAttributes.includes(phoneNumber.id)
                                            : undefined}
                                        on:unregistered={unregisterPhone}
                                        {phoneNumber}
                                        {serviceContainer} />
                                {/each}
                            {/if}
                        </div>
                    </section>
                {/if}
                {#if dataRequest === undefined || dataRequest?.requirements.email !== undefined}
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
                                <p class="advice">
                                    Click the button above to register a new email address
                                </p>
                            {:else}
                                {#each profile.identity.email.addresses as emailAddress, i (emailAddress)}
                                    <RegisteredEmailAddress
                                        on:grant={grant}
                                        on:revoke={revoke}
                                        on:codeSent={emailCodeSent}
                                        on:codeVerified={emailCodeVerified}
                                        visibility={selectedApp && !loadingAppProfile
                                            ? visibleAttributes.includes(emailAddress.id)
                                            : undefined}
                                        on:unregistered={unregisterEmail}
                                        {emailAddress}
                                        {serviceContainer} />
                                {/each}
                            {/if}
                        </div>
                    </section>
                {/if}
            {/if}
        </div>
    </main>
    <div class="right">
        <div class="right-inner" />
    </div>
</div>

<style type="text/scss">
    .wrapper {
        display: flex;
    }
    .left,
    .right {
        @include fullHeight();
        @include fullScreenImg("../assets/quiet.jpg");
        flex: auto;
    }

    .right-inner {
        height: 100%;
        backdrop-filter: invert(1);
    }

    .main {
        display: flex;
        flex-direction: column;
        flex: 0 0 900px;
        max-width: 900px;
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
        padding: $sp5;
        background-color: #ffffff;
        @include box-shadow(1);
        border-radius: $sp4;

        &.loading {
            min-height: 500px;
        }
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
