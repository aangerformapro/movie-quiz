<script>
    import { useNavigate, useParams } from "svelte-navigator";
    import { getEntry, getNotFound, getRandom, tv } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import { decode } from "../../modules/utils/utils.mjs";

    import Series from "../components/sliders/Series.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    import { writable } from "svelte/store";

    const params = useParams(),
        navigate = useNavigate();

    const item = writable(null);

    $: !$params.id && navigate("" + getRandom(getNotFound($tv), 1)[0].id);
    $: $item = getEntry(decode($params.id));
</script>

{#if item}
    <Cover item={$item}>
        <Notify />
    </Cover>
    <GameForm item={$item} />
    <Series />
{/if}
