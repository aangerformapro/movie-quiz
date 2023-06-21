<script>
    import { getLastFound } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import Series from "../components/sliders/Series.svelte";
</script>

<Cover item={getLastFound()} />
<Movies />
<Series />
