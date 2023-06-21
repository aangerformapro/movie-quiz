<script>
    import { useParams } from "svelte-navigator";
    import { decode } from "../../modules/utils/utils.mjs";
    import { getEntry } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    const params = useParams();
    let item;
    $: item = getEntry(decode($params.id));
</script>

{#if item}
    <Cover {item}>
        <Notify />
    </Cover>
    <GameForm {item} />
    <Movies />
{/if}
