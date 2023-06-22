<script>
    import { useParams } from "svelte-navigator";
    import { current, getEntry } from "../App/game.mjs";
    import { decode } from "../../modules/utils/utils.mjs";
    import Cover from "../components/Cover.svelte";
    import Series from "../components/sliders/Series.svelte";
    import GameForm from "../components/GameForm.svelte";
    import Notify from "../components/Notify.svelte";
    const params = useParams();

    $: $current = getEntry(decode($params.id));
</script>

<Cover>
    <Notify />
</Cover>
<GameForm />
<Series />
