<script>
    import MoviesNotFound from "./../components/slides/MoviesNotFound.svelte";
    import { current, getLastFound } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import MoviesFound from "../components/slides/MoviesFound.svelte";
    import SeriesNotFound from "../components/slides/SeriesNotFound.svelte";
    import SeriesFound from "../components/slides/SeriesFound.svelte";

    $current = getLastFound();
</script>

{#if $current}
    <Cover />

    <MoviesNotFound />
    <SeriesNotFound />
    <MoviesFound />
    <SeriesFound />
{/if}
