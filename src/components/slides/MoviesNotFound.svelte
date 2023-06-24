<script>
    import { useLocation } from "svelte-navigator";
    import swiper from "../../App/swiper.mjs";
    import { MediaType, getRandom, movies } from "../../App/game.mjs";
    import { onMount } from "svelte";
    import Poster from "./Poster.svelte";

    let route, items;

    const location = useLocation(),
        notFound = movies.notFound;

    // $: items = getRandom($notFound, 20);
    $: items = getRandom($notFound, 20);

    onMount(() => {
        route =
            $location.pathname.indexOf(MediaType.ALL.route) > -1
                ? MediaType.ALL.route
                : MediaType.MOVIE.route;
    });
</script>

{#if items.length}
    <div class="section mx-auto mb-3 px-3 user-select-none">
        <h3 class="my-3 d-flex justify-content-center">
            Les Films - A trouver <small class="ms-3 fw-light fs-5"
                >[{$notFound.length}]</small
            >
        </h3>

        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll" use:swiper>
                <div class="swiper-wrapper d-flex">
                    {#each items as item}
                        <div class="swiper-slide">
                            <Poster
                                href="{route}/{item.id}"
                                cover={item.cover.w780}
                                found="not-found"
                            />
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
