<script>
    import { links } from "svelte-navigator";
    import { getYoutubeUrl, isFound } from "../App/game.mjs";
    import { isPlainObject } from "../../modules/utils/utils.mjs";

    export let item = {},
        force = false;

    if (!isPlainObject(item) || !item.title) {
        force = false;
    }

    let youtube = getYoutubeUrl(item),
        { id, title } = item,
        found = isFound(item);
</script>

{#if found || force}
    <!-- S'affiche apres que le résultat ait été trouvé -->
    <div class="heading p-lg-3">
        <h3 class="heading-title text-uppercase mb-3">
            {title}
        </h3>

        <div class="d-flex flex-column flex-lg-row align-items-center">
            {#if youtube}
                <a
                    href={youtube}
                    target="_blank"
                    class="button-play btn btn-light btn-lg col-12 col-lg-auto"
                >
                    <i class="ng-play-arrow" size="32" />
                    <span>Voir la bande annonce</span>
                </a>
            {/if}
            {#if id}
                <a
                    href="/details/{id}"
                    class="button-infos btn btn-secondary btn-lg col-12 col-lg-auto ms-lg-3 my-3 my-lg-0"
                    use:links
                >
                    <i class="ng-info" size="32" />
                    <span>Plus d'infos</span>
                </a>
            {/if}
        </div>
    </div>
{/if}
