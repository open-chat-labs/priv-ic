<script lang="ts">
    export let cls = "";
    export let loading: boolean = false;
    export let disabled: boolean = false;
    export let secondary: boolean = false;
    export let small: boolean = false;
    export let fill: boolean = false;
</script>

<button
    on:click
    class={cls}
    class:loading
    class:disabled
    class:small
    {disabled}
    class:secondary
    class:fill>
    {#if !loading}
        <slot />
    {/if}
</button>

<style type="text/scss">
    button {
        transition: background ease-in-out 200ms;
        background: #22a7f2;
        color: #ffffff;
        padding: $sp3 $sp6;
        cursor: pointer;
        border: 1px solid #22a7f2;
        min-height: 45px;
        min-width: 150px;
        @include font(book, normal, fs-100);

        &.small {
            padding: $sp2 $sp5;
            min-height: $sp5;
            min-width: 0;
        }

        &:hover {
            background: #52baf5;
        }

        &.loading {
            @include loading-spinner(1em, 0.5em, false, #ffffff);
        }

        &.disabled {
            background: "#cccccc";
            color: "#999999";
            cursor: not-allowed;
            border: 1px solid transparent;
        }

        &.secondary {
            background: #ffffff;
            color: #22a7f2;
            border: 1px solid #22a7f2;
        }

        &.fill {
            width: 100%;
            height: 100%;
        }
    }
</style>
