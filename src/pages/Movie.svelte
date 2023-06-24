<script>
    import { useParams } from "svelte-navigator";
    import { decode } from "../../modules/utils/utils.mjs";
    import { current, getEntry } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    import NotFound from "./NotFound.svelte";
    import MoviesNotFound from "../components/slides/MoviesNotFound.svelte";
    import MoviesFound from "../components/slides/MoviesFound.svelte";
    const params = useParams();

    $: $current = getEntry(decode($params.id));
</script>

{#if $current}
    <Cover>
        <Notify />
    </Cover>
    <GameForm />
    <MoviesNotFound />
    <MoviesFound />
{:else}
    <NotFound />
{/if}
