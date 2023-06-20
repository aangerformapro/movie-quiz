<script>
    import { onMount } from "svelte";

    import { current, getLastFound, ready } from "../App/game.mjs";

    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import Series from "../components/sliders/Series.svelte";
</script>

{#if $ready}
    <Cover item={getLastFound()} />

    <Movies />
    <Series />
{/if}
