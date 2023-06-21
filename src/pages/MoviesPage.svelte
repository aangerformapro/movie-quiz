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

    const params = useParams(),
        navigate = useNavigate();

    let item;

    onMount(() => {
        if (!$params.id) {
            let id = getRandom(getNotFound($movies), 1)[0].id;
            navigate("" + id);
            return;
        }
        item = getEntry(decode($params.id));
        if (!item) {
            Dialog.alert("Movie not found !").then(() => history.back());
            return;
        }
    });
</script>

{#if item && item.id}
    <Cover {item}>
        <Notify />
    </Cover>
    <GameForm />
    <Movies />
{/if}
