<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { appLookup } from "../domain/identity/identity";
    import type { ClientApp } from "../domain/identity/identity";

    export let app: ClientApp;
    export let selected: boolean = false;
</script>

<div class="client-app" class:selected on:click>
    <div class="name">{appLookup[app.domainName]}</div>
</div>

<style type="text/scss">
    .client-app {
        padding: $sp4;
        border: 1px solid #cccccc;
        background-color: #fff;
        border-radius: $sp6;
        margin-bottom: $sp4;
        margin-right: $sp4;
        display: inline-block;
        cursor: pointer;
        transition: transform 300ms ease-in-out;

        &:hover {
            transform: scale(1.05);
            @include box-shadow(1);
        }

        &.selected {
            color: white;
            background-color: hotpink;
            transform: scale(1.05);
            @include box-shadow(1);
        }

        .name {
            @include ellipsis();
            @include size-below(xs) {
                color: #fff;
            }
        }
    }
</style>
