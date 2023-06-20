<script>
    import { onMount } from "svelte";

    import { current, ready } from "../App/game.mjs";

    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import Series from "../components/sliders/Series.svelte";
</script>

{#if $ready}
    <Cover item={$current} />

    <Movies />
    <Series />
{/if}
