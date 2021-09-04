<script lang="ts">
    import { appLookup } from "../domain/identity/identity";
    import type { ClientApp } from "../domain/identity/identity";
    import Loading from "./Loading.svelte";

    export let app: ClientApp;
    export let selected: boolean = false;
    export let loading: boolean = false;
</script>

<div class="client-app" class:selected on:click>
    <div class="name">{appLookup[app.domainName]}</div>
    {#if selected && loading}
        <div class="loading" />
    {/if}
</div>

<style type="text/scss">
    .client-app {
        padding: $sp4;
        border: 1px solid #cccccc;
        background-color: #fff;
        border-radius: $sp6;
        margin-bottom: $sp4;
        margin-right: $sp4;
        display: inline-flex;
        cursor: pointer;
        transition: transform 300ms ease-in-out;

        &:hover {
            transform: scale(1.05);
            @include box-shadow(1);
        }

        &.selected {
            color: white;
            background-color: hotpink;
            border: 1px solid hotpink;
            transform: scale(1.05);
            @include box-shadow(1);
        }

        .name {
            @include ellipsis();
        }
    }

    .loading {
        width: 40px;
        @include loading-spinner(1em, 0.5em, false, #ffffff);
    }
</style>
