<script>
    /**
     * Auto redirect to random entry in the not found pile
     */
    import { onMount } from "svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import { MediaType, getRandom } from "../App/game.mjs";
    import { isEmpty } from "../../modules/utils/utils.mjs";
    import NotFound from "../pages/NotFound.svelte";

    const loc = useLocation(),
        navigate = useNavigate();

    let error = false;
    function redirect() {
        const mediatype = MediaType.cases().find(
            (item) => item.route === $loc.pathname
        );

        if (mediatype instanceof MediaType) {
            const id = String(getRandom(mediatype.notFound, 1)[0]?.id ?? "");

            if (!isEmpty(id)) {
                return navigate(id, { replace: true });
            }
        }

        error = true;
    }

    $: console.debug("err", error);

    onMount(() => {
        redirect();
    });
</script>

{#if error}
    <NotFound />
{/if}
