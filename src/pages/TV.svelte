<script>
    import { useParams } from "svelte-navigator";
    import { current, getEntry } from "../App/game.mjs";
    import { decode } from "../../modules/utils/utils.mjs";
    import Cover from "../components/Cover.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    import NotFound from "./NotFound.svelte";
    import SeriesNotFound from "../components/slides/SeriesNotFound.svelte";
    import SeriesFound from "../components/slides/SeriesFound.svelte";
    const params = useParams();

    $: $current = getEntry(decode($params.id));
</script>

{#if $current}
    <Cover>
        <Notify />
    </Cover>
    <GameForm />
    <SeriesNotFound />
    <SeriesFound />
{:else}
    <NotFound />
{/if}
