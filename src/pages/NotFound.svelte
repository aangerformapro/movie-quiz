<script>
    import { onMount } from "svelte";
    import { loaderDisplayed } from "../App/utils.mjs";

    onMount(() => {
        $loaderDisplayed = false;
    });
</script>

<div
    class="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center user-select-none"
    id="page-not-found"
>
    <div class="error-message">OOPS</div>
</div>

<style>
    .error-message {
        color: var(--netflix-red);
        font-size: 48px;
        font-weight: 800;
        animation: rebound 2s ease both;
    }

    #page-not-found {
        pointer-events: none;
    }

    @keyframes rebound {
        from {
            transform: scale(0);
        }
        33%,
        66% {
            transform: scale(2.5);
        }
        50%,
        to {
            transform: scale(1);
        }
    }
</style>
