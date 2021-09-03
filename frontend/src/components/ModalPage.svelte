<script lang="ts">
    export let minHeight: string | undefined = undefined;
    export let bgClass: "locked" = "locked";
</script>

<div class={`modal-page ${bgClass}`}>
    <div class="modal-page-panel" style="min-height: {minHeight}">
        <slot />
    </div>
</div>

<style type="text/scss">
    .modal-page {
        display: flex;
        justify-content: center;
        align-items: center;

        &.locked {
            @include fullScreenImg("../assets/locked.jpg");
        }

        @include fullHeight();
    }

    .modal-page-panel {
        padding: $sp5 $sp6;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-align: center;
        align-items: center;
        border-radius: $sp5;
        width: 50%;
        max-width: 500px;
        background-color: rgba(255, 255, 255, 0.5);
        color: #191919;
        box-shadow: 0px 13px 13px 0px rgba(85, 85, 85, 0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px inset rgba(255, 255, 255, 0.3);
        @include z-index(login);
        @include size-below(md) {
            width: 100%;
            margin: 0 $sp4;
        }
    }
</style>
