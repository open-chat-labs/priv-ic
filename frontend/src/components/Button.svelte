<script lang="ts">
    export let cls = "";
    export let loading: boolean = false;
    export let disabled: boolean = false;
    export let secondary: boolean = false;
    export let small: boolean = false;
    export let fill: boolean = false;
    export let accent: boolean = false;
    export let bad: boolean = false;
    export let good: boolean = false;
</script>

<button
    on:click
    class={cls}
    class:loading
    class:disabled
    class:small
    {disabled}
    class:secondary
    class:accent
    class:good
    class:bad
    class:fill>
    {#if !loading}
        <slot />
    {/if}
</button>

<style type="text/scss">
    button {
        transition: background ease-in-out 200ms;
        background: #191919;
        color: #ffffff;
        padding: $sp3 $sp6;
        cursor: pointer;
        border: 1px solid #191919;
        min-height: 45px;
        min-width: 150px;
        @include font(book, normal, fs-100);

        &.small {
            padding: $sp2 $sp5;
            @include font(book, normal, fs-90);
        }

        &:hover {
            background: #333333;
        }

        &.loading {
            @include loading-spinner(1em, 0.5em, false, #ffffff);
        }

        &.disabled {
            background: #cccccc;
            color: #999999;
            cursor: not-allowed;
            border: 1px solid transparent;
        }

        &.secondary {
            background: #ffffff;
            color: #191919;
            border: 1px solid #191919;
        }

        &.accent {
            background: hotpink;
            color: #ffffff;
            border: 1px solid #ffffff;
        }

        &.good {
            background: seagreen;
            color: #ffffff;
            border: 1px solid #ffffff;
        }

        &.bad {
            background: orangered;
            color: #ffffff;
            border: 1px solid #ffffff;
        }

        &.fill {
            width: 100%;
            height: 100%;
        }
    }
</style>
