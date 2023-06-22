<script>
    import { useParams } from "svelte-navigator";
    import { onMount } from "svelte/internal";
    import { decode } from "../../modules/utils/utils.mjs";
    import { NOPIC, getEntry, isFound, current } from "../App/game.mjs";
    import Dialog from "../../modules/components/dialog.mjs";
    import { loaderDisplayed } from "../App/utils.mjs";
    import Cover from "../components/Cover.svelte";

    import swiper from "../App/swiper.mjs";
    import NotFound from "./NotFound.svelte";

    const params = useParams();

    let found;

    $current = getEntry(decode($params.id));

    // params.subscribe()

    onMount(() => {
        if ($current) {
            found = isFound($current);

            if (!found) {
                $current = null;
            }
        }
    });
</script>

{#if $current}
    <Cover more={false} />
    <div class="media-info d-flex flex-column">
        <h4 class="my-3">Synopsis</h4>
        <p class="overview">{$current.overview.fr || $current.overview.en}</p>
    </div>
    {#if $current.cast.length}
        <div class="section actors mx-auto mb-3 px-3">
            <h3 class="my-3">Les acteurs</h3>
            <div class="d-flex align-items-center justify-content-between">
                <div class="swiper overflow-x-scroll" use:swiper>
                    <div class="swiper-wrapper d-flex">
                        {#each $current.cast as actor}
                            {#if actor.picture.w185}
                                <div class="swiper-slide m-2">
                                    <div class="poster flat">
                                        <img
                                            src={actor.picture.w185}
                                            alt={actor.name}
                                        />
                                    </div>
                                    <div class="actor d-flex flex-column">
                                        <strong class="actor-name"
                                            >{actor.name}</strong
                                        >
                                        <small class="role"
                                            >{actor.character}</small
                                        >
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>

                <div class="chevron-next">
                    <i class="ng-chevron-right" size="32" />
                </div>
            </div>
        </div>
    {/if}
{:else}
    <NotFound />
{/if}
