<script>
    import { useNavigate, useParams } from "svelte-navigator";
    import { getEntry, getNotFound, getRandom, tv } from "../App/game.mjs";
    import { decode } from "../../modules/utils/utils.mjs";
    import Cover from "../components/Cover.svelte";
    import Series from "../components/sliders/Series.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";

    const params = useParams(),
        navigate = useNavigate();

    let item;
    $: console.debug(decode($params.id));
    $: item = getEntry(decode($params.id));
</script>

{#if item}
    <Cover {item}>
        <Notify />
    </Cover>
    <GameForm {item} />
    <Series />
{/if}
