<script>
    import { links } from "svelte-navigator";
    import { movies, getFound, getNotFound } from "../../App/game.mjs";

    let found = [],
        notfound = [];

    $: found = getFound($movies);
    $: notfound = getNotFound($movies);
</script>

{#if notfound.length}
    <div class="section mx-auto mb-3">
        <h3 class="my-3">Les Films - A trouver</h3>

        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll">
                <div class="swiper-wrapper d-flex">
                    {#each notfound as item}
                        <div class="swiper-slide poster flat m-2 not-found">
                            <div class="poster">
                                <!-- <div class="title">Le titre du film</div> -->
                                <a href="/movies/{item.id}" use:links>
                                    <img
                                        src={item.cover[0].w300 ??
                                            item.cover[0].w780}
                                        alt="Film à deviner"
                                    />
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="chevron-next">
                <svg
                    fill="currentColor"
                    class="ng-svg-icon"
                    width="32"
                    height="32"
                >
                    <i class="ng-chevron-right" />
                </svg>
            </div>
        </div>
    </div>
{/if}
{#if found.length}
    <div class="section mx-auto mb-3">
        <h3 class="my-3 px-0">Les Films - Trouvés</h3>
        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll">
                <div class="swiper-wrapper d-flex">
                    {#each found as item}
                        <div class="swiper-slide poster m-2">
                            <div class="title">{item.title}</div>
                            <a href="/details/{item.id}">
                                <img
                                    src={item.poster[0].w342}
                                    alt="Poster du film"
                                />
                            </a>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="chevron-next">
                <svg
                    fill="currentColor"
                    class="ng-svg-icon"
                    width="32"
                    height="32"
                >
                    <i class="ng-chevron-right" />
                </svg>
            </div>
        </div>
    </div>
{/if}
