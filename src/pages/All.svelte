<script>
    import Movies from "./../components/sliders/Movies.svelte";
    import { useParams } from "svelte-navigator";
    import { getEntry } from "../App/game.mjs";
    import { decode } from "../../modules/utils/utils.mjs";
    import Cover from "../components/Cover.svelte";
    import Series from "../components/sliders/Series.svelte";
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
    <Series />
{/if}
