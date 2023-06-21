<script>
    import { links } from "svelte-navigator";
    import {
        tv,
        getFound,
        getNotFound,
        getRandom,
        settings,
        NOPIC,
    } from "../../App/game.mjs";
    import createResourceLoader from "../../App/loader.mjs";
    import swiper from "../../App/swiper.mjs";
    import { noop } from "svelte/internal";

    let found = [],
        notfound = [];

    const { onload } = createResourceLoader(noop);

    $: found = getFound($tv);
    $: notfound = getRandom(getNotFound($tv), $settings.notFoundToDisplay);
</script>

{#if notfound.length}
    <div class="section mx-auto mb-3 px-3">
        <h3 class="my-3">Les Séries - A trouver</h3>
        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll" use:swiper>
                <div class="swiper-wrapper d-flex">
                    {#each notfound as item}
                        <div class="swiper-slide">
                            <div class="poster flat m-2 not-found">
                                <!-- <div class="title">Le titre du film</div> -->
                                <a href="/tv/{item.id}" use:links>
                                    <img
                                        src={item.cover.w780}
                                        alt="Série à deviner"
                                        use:onload
                                    />
                                </a>
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
{#if found.length}
    <div class="section mx-auto mb-3 px-3">
        <h3 class="my-3 px-0">Les Séries - Trouvées</h3>
        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll" use:swiper>
                <div class="swiper-wrapper d-flex">
                    {#each found as item}
                        <div class="swiper-slide">
                            <div class="poster m-2">
                                <div class="title">{item.title}</div>
                                <a href="/details/{item.id}">
                                    <img
                                        src={item.poster.w342 ?? NOPIC}
                                        alt="Poster de la série"
                                        use:onload
                                    />
                                </a>
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
