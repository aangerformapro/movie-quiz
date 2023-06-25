<script>
    import swiper from "../../App/swiper.mjs";
    import { movies } from "../../App/game.mjs";
    import Poster from "./Poster.svelte";
    let items;
    const found = movies.found;
    $: items = $found;
</script>

{#if items.length}
    <div class="section mx-auto mb-3 px-3 user-select-none">
        <h3 class="my-3 d-flex justify-content-center">
            Les Films - Trouvés
            <small class="ms-3 fw-light fs-5">[{items.length}]</small>
        </h3>

        <div class="d-flex align-items-center justify-content-between">
            <div class="swiper overflow-x-scroll" use:swiper>
                <div class="swiper-wrapper d-flex">
                    {#each items as item}
                        <div class="swiper-slide">
                            <Poster
                                href="details/{item.id}"
                                cover={item.poster.w342}
                                title={item.title}
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
