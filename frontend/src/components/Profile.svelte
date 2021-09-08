<script lang="ts">
    import { onMount } from "svelte";
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

    import CheckCircleOutline from "svelte-material-icons/CheckCircleOutline.svelte";
    import CloseCircleOutline from "svelte-material-icons/CloseCircleOutline.svelte";
    import Refresh from "svelte-material-icons/Refresh.svelte";
    import HoverIcon from "./HoverIcon.svelte";
    import type { ServiceContainer } from "../services/serviceContainer";
    import Loading from "./Loading.svelte";
    import NewPhoneNumber from "./NewPhoneNumber.svelte";
    import ClientApp from "./ClientApp.svelte";
    import NewEmailAddress from "./NewEmailAddress.svelte";
    import RegisteredAttribute from "./RegisteredAttribute.svelte";
    import { returnToClient } from "../services/auth";
    import Link from "./Link.svelte";
    import { UnsupportedValueError } from "../utils/error";
    import type { DataRequestWithOrigin, DataRequirement, DataResponse } from "../utils/authClient";
    import Logout from "svelte-material-icons/Logout.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let serviceContainer: ServiceContainer;
    export let dataRequest: DataRequestWithOrigin | undefined = undefined;
    let profile: Profile | undefined;
    let addingPhoneNumber: boolean = false;
    let addingEmail: boolean = false;
    let loadingAppProfile: boolean = false;
    let visibleAttributes: bigint[] = [];
    let requirementsMet: boolean = dataRequest === undefined ? true : false;
    let requirements: Requirement[] = [];
    let returning: boolean = false;
    let dataResponse: DataResponse = {};

    type Requirement = {
        message: string;
        met: boolean;
    };

    $: selectedApp = dataRequest ? { domainName: openchat } : undefined;

    $: {
        requirements = evaluateRequirements(visibleAttributes, profile, dataRequest);
        requirementsMet = profile !== undefined && !requirements.some((r) => !r.met);

        if (requirementsMet && !returning) {
            returning = true;
            returnToClient(dataResponse ?? {}).catch((err) => {
                returning = false;
                throw err;
            });
        }
    }

    function evaluateRequirements(
        visibleAttributes: bigint[],
        profile: Profile | undefined,
        dataRequest: DataRequestWithOrigin | undefined
    ): Requirement[] {
        if (dataRequest === undefined) return [];
        if (profile === undefined) return [];

        const requirements = [];

        if (dataRequest.phone !== undefined) {
            const message = requirementStringPerRequirement(
                "phone number",
                dataRequest.origin,
                dataRequest.phone
            );

            const phone =
                dataRequest.phone === "exists"
                    ? profile.identity.phone.numbers.find((n) => n.status === "verified")
                    : profile.identity.phone.numbers.find(
                          (n) => n.status === "verified" && visibleAttributes.includes(n.id)
                      );

            requirements.push({
                message,
                met: phone !== undefined,
            });

            dataResponse.phone =
                dataRequest.phone === "exists"
                    ? phone !== undefined
                        ? "exists"
                        : undefined
                    : phone !== undefined
                    ? phone.value
                    : undefined;
        }

        if (dataRequest.email !== undefined) {
            const message = requirementStringPerRequirement(
                "email address",
                dataRequest.origin,
                dataRequest.email
            );

            const email =
                dataRequest.email === "exists"
                    ? profile.identity.email.addresses.find((n) => n.status === "verified")
                    : profile.identity.email.addresses.find(
                          (n) => n.status === "verified" && visibleAttributes.includes(n.id)
                      );

            requirements.push({
                message,
                met: email !== undefined,
            });

            dataResponse.email =
                dataRequest.phone === "exists"
                    ? email !== undefined
                        ? "exists"
                        : undefined
                    : email !== undefined
                    ? email.value
                    : undefined;
        }

        return requirements;
    }

    function requirementStringPerRequirement(
        attrName: string,
        app: string,
        req: DataRequirement
    ): string {
        if (req === "exists") {
            return `You must have at least one verified ${attrName}. ${app} does not require access to this ${attrName}.`;
        }

        if (req === "full-access") {
            return `You must grant ${app} access to at least one verified ${attrName}.`;
        }
        throw new UnsupportedValueError("Unexpected data requirement", req);
    }

    onMount(() => {
        serviceContainer
            .getProfile()
            .then((p) => {
                profile = p;
            })
            .catch((_err) => {
                console.log("Error loading profile: ", _err);
                alert(_err);
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
            // todo - this doesn't work if the app is not registered yet
            serviceContainer.setVisibleProfileAttributes(domainName, visibleAttributes).then(() => {
                serviceContainer.visibleProfileAttributes(domainName).then((resp) => {
                    if (resp !== "application_not_registered") {
                        visibleAttributes = resp;
                    } else {
                        console.log(resp);
                    }
                });
            });
        }
    }

    function revoke(ev: CustomEvent<bigint>) {
        if (selectedApp) {
            const { domainName } = selectedApp;
            visibleAttributes = visibleAttributes.filter((attr) => attr !== ev.detail);
            // todo - this doesn't work if the app is not registered yet
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
    <main class="main">
        {#if dataRequest === undefined}
            <div class="profile">
                <div class="header">
                    <h1 class="headline">Welcome to PrivIC</h1>
                    <span title="logout" class="logout" on:click={() => dispatch("logout")}>
                        <HoverIcon>
                            <Logout size={"1.6em"} color={"#aaa"} />
                        </HoverIcon>
                    </span>
                </div>

                <p class="blurb">
                    All of your personal information in one place. You are in control of exactly
                    which personal information your favourite Dapps have access to. See at a glance
                    who is using what and revoke access at any time.
                </p>
            </div>
        {/if}
        <div class="profile" class:loading={profile === undefined}>
            {#if profile === undefined}
                <Loading />
            {:else}
                {#if dataRequest !== undefined}
                    <section class="section">
                        <div class="section-header">
                            <h5 class="section-title">OpenChat</h5>
                            <span class="section-subtitle"
                                >requires some access to your personal data</span>
                        </div>
                        <div class="section-body client-apps">
                            {#each requirements as req, i (req)}
                                <div class="requirement">
                                    <div class="met">
                                        {#if req.met}
                                            <CheckCircleOutline size={"1.5em"} color={"seagreen"} />
                                        {:else}
                                            <CloseCircleOutline size={"1.5em"} color={"darkred"} />
                                        {/if}
                                    </div>
                                    <div class="msg">{req.message}</div>
                                </div>
                            {/each}

                            {#if returning}
                                <div class="requirement all-met">
                                    <div class="met">
                                        <Refresh size={"1.5em"} color={"hotpink"} />
                                    </div>
                                    <div class="msg">
                                        Requirements met - wait while we return you to OpenChat
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </section>
                {/if}

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
                {#if dataRequest === undefined || dataRequest?.phone !== undefined}
                    <section class="section">
                        <div class="section-header">
                            <h5 class="section-title">Phone numbers</h5>
                            <Link on:click={() => (addingPhoneNumber = true)} underline="always"
                                >+ new</Link>
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
                                    <RegisteredAttribute
                                        on:grant={grant}
                                        on:revoke={revoke}
                                        on:codeSent={phoneCodeSent}
                                        on:codeVerified={phoneCodeVerified}
                                        visibility={selectedApp && !loadingAppProfile
                                            ? visibleAttributes.includes(phoneNumber.id)
                                            : undefined}
                                        on:unregistered={unregisterPhone}
                                        attribute={phoneNumber}
                                        {serviceContainer}>
                                        <span class="code">(+{phoneNumber.value.countryCode})</span>
                                        {phoneNumber.value.number}
                                    </RegisteredAttribute>
                                {/each}
                            {/if}
                        </div>
                    </section>
                {/if}
                {#if dataRequest === undefined || dataRequest?.email !== undefined}
                    <section class="section">
                        <div class="section-header">
                            <h5 class="section-title">Email addresses</h5>
                            <Link on:click={() => (addingEmail = true)} underline="always"
                                >+ new</Link>
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
                                    <RegisteredAttribute
                                        on:grant={grant}
                                        on:revoke={revoke}
                                        on:codeSent={emailCodeSent}
                                        on:codeVerified={emailCodeVerified}
                                        visibility={selectedApp && !loadingAppProfile
                                            ? visibleAttributes.includes(emailAddress.id)
                                            : undefined}
                                        on:unregistered={unregisterEmail}
                                        attribute={emailAddress}
                                        {serviceContainer}>
                                        {emailAddress.value}
                                    </RegisteredAttribute>
                                {/each}
                            {/if}
                        </div>
                    </section>
                {/if}
            {/if}
        </div>
    </main>
</div>

<style type="text/scss">
    :global(.requirement.all-met .met svg) {
        @include spin();
    }

    .wrapper {
        display: flex;
        @include fullScreenImg("../assets/quiet.jpg");
        background-position: 500px;
    }

    .main {
        display: flex;
        flex-direction: column;
        flex: 0 0 800px;
        max-width: 800px;
        padding: 20px 50px 50px 50px;
        @include fullHeight();
        margin: auto;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        overflow: auto;

        @include size-below(xs) {
            padding: 0;
            flex: 1;
            background-color: #efefef;
        }
    }

    .profile {
        padding: $sp5;
        background-color: #efefef;
        @include box-shadow(1);
        border-radius: $sp4;
        margin-bottom: $sp4;

        &.loading {
            min-height: 500px;
        }

        @include size-below(xs) {
            border-radius: 0;
            box-shadow: none;
        }
    }

    .headline {
        @include font(bold, normal, fs-220);
        margin-bottom: $sp5;
    }

    .blurb {
        margin-bottom: $sp5;
        @include font(light, normal, fs-90);
    }

    .advice {
        padding: $sp4;
        @include font(light, normal, fs-90);
    }

    .section {
        @include box-shadow(1);
        background-color: #ffffff;
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
        }

        .client-apps {
            padding: $sp4;
        }
    }

    .requirement {
        display: flex;
        @include font(book, normal, fs-90);
        justify-content: space-between;
        align-items: center;
        margin-bottom: $sp3;

        .met {
            flex: 0 0 35px;
        }
        .msg {
            flex: auto;
        }

        &.all-met {
            margin-top: $sp4;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
    }
</style>
