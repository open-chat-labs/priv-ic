<script lang="ts">
    export let value: string = "";
    export let invalid: boolean = false;
    let select: HTMLSelectElement;
</script>

<select class:invalid bind:value bind:this={select} class={`select`}>
    <slot />
</select>

<style type="text/scss">
    :global(option) {
        color: #191919;
    }

    .select {
        transition: border ease-in-out 300ms;
        display: block;
        width: 100%;
        height: 40px;
        line-height: 24px;
        padding: $sp1 $sp3;
        @include font(book, normal, fs-100);
        color: #191919;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        outline: none;
        border-radius: $sp2;
        margin-bottom: $sp4;

        &.invalid {
            border: 1px solid #cf6679;
            box-shadow: 0 0 5px 1px #cf6679;
        }
    }
</style>
