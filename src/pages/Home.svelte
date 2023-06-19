<script>
    import { onMount } from "svelte";

    import { current, ready } from "../App/game.mjs";
    import { cover } from "../components/cover.mjs";
    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
</script>

{#if $ready}
    <Cover />

    <Movies />
{/if}
