<script>
    import { links } from "svelte-navigator";
    import {
        current,
        getEmbedHtml,
        getYoutubeUrl,
        isFound,
    } from "../App/game.mjs";
    import { IS_TOUCH, isPlainObject } from "../../modules/utils/utils.mjs";
    import Dialog, { Position } from "../../modules/components/dialog.mjs";

    export let force = false,
        more = true;

    let dialog;

    if (!isPlainObject($current) || !$current.title) {
        force = false;
    }

    function makeDialog(e) {
        if (!IS_TOUCH) {
            e.preventDefault();
            dialog ??= new Dialog(embed, $current.title, "youtube-video");
            dialog.position = Position.TOP;
            dialog.elements.ok.hidden = true;
            dialog.canCancel = false;
            dialog.showModal(false).then(() => dialog.element.remove());
        }
    }

    let youtube = getYoutubeUrl($current),
        embed = getEmbedHtml($current),
        { id, title } = $current,
        found = isFound($current);
</script>

{#if found || force}
    <!-- S'affiche apres que le résultat ait été trouvé -->
    <div class="heading p-5 p-lg-0">
        <h3 class="heading-title text-uppercase mb-3">
            {title}
        </h3>

        <div class="d-flex flex-column flex-lg-row align-items-center">
            {#if youtube}
                <a
                    href={youtube}
                    target="_blank"
                    class="button-play btn btn-light btn-lg col-12 col-lg-auto"
                    on:click={makeDialog}
                >
                    <i class="ng-play-arrow" size="32" />
                    <span>Voir la bande annonce</span>
                </a>
            {/if}
            {#if id && more}
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
