<script>
    import { Route, useNavigate, useParams } from "svelte-navigator";
    import { onMount } from "svelte";
    import { getEntry, getNotFound, getRandom, movies } from "../App/game.mjs";
    import Cover from "../components/Cover.svelte";
    import Movies from "../components/sliders/Movies.svelte";
    import { decode } from "../../modules/utils/utils.mjs";
    import Dialog from "../../modules/components/dialog.mjs";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    import { writable } from "svelte/store";

    const params = useParams(),
        navigate = useNavigate();

    const item = writable(null);

    $: !$params.id && navigate("" + getRandom(getNotFound($movies), 1)[0].id);
    $: $item = getEntry(decode($params.id));
</script>

{#if $item}
    <Cover item={$item}>
        <Notify />
    </Cover>
    <GameForm item={$item} />
    <Movies />
{/if}
