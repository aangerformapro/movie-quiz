<script>
    import { useParams } from "svelte-navigator";
    import { onMount } from "svelte/internal";
    import { decode } from "../../modules/utils/utils.mjs";
    import { NOPIC, getEntry, isFound } from "../App/game.mjs";
    import Dialog from "../../modules/components/dialog.mjs";
    import { loaderDisplayed } from "../App/utils.mjs";
    import Cover from "../components/Cover.svelte";

    import swiper from "../App/swiper.mjs";

    const params = useParams();

    let item, found;

    function RouteNotFound() {
        Dialog.alert("Média non trouvé").then(() => history.back());
    }

    function DoNotTryToCheat() {
        Dialog.alert("N'essayez-pas de tricher !!!").then(() => history.back());
    }

    // params.subscribe()

    onMount(() => {
        item = getEntry(decode($params.id));
        if (!item) {
            $loaderDisplayed = false;
            return RouteNotFound();
        }

        found = isFound(item);

        if (!found) {
            item = null;
            $loaderDisplayed = false;
            DoNotTryToCheat();
        }
    });
</script>

{#if item}
    <Cover {item} more={false} />
    <div class="media-info d-flex flex-column">
        <h4 class="my-3">Synopsis</h4>
        <p class="overview">{item.overview.fr || item.overview.en}</p>
    </div>
    {#if item.cast.length}
        <div class="section actors mx-auto mb-3 px-3">
            <h3 class="my-3">Les acteurs</h3>
            <div class="d-flex align-items-center justify-content-between">
                <div class="swiper overflow-x-scroll" use:swiper>
                    <div class="swiper-wrapper d-flex">
                        {#each item.cast as actor}
                            <div class="swiper-slide m-2">
                                <div class="poster flat">
                                    <img
                                        src={actor.picture.w185 ?? NOPIC}
                                        alt={actor.name}
                                    />
                                </div>
                                <div class="actor d-flex flex-column">
                                    <strong class="actor-name"
                                        >{actor.name}</strong
                                    >
                                    <small class="role">{actor.character}</small
                                    >
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="chevron-next">
                    <i class="ng-chevron-right" size="32" />
                </div>
            </div>
        </div>
    {/if}
{/if}
