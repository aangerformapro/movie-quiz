<script>
    import { useParams } from "svelte-navigator";
    import { decode } from "../../modules/utils/utils.mjs";
    import { current, getEntry } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    import NotFound from "./NotFound.svelte";
    const params = useParams();

    $: $current = getEntry(decode($params.id));
</script>

{#if $current}
    <Cover>
        <Notify />
    </Cover>
    <GameForm />
    <Movies />
{:else}
    <NotFound />
{/if}
