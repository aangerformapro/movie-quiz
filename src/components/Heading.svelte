<script>
    import Router from "../../modules/components/router.mjs";

    export let titre = "",
        youtube = "",
        id = "";
</script>

<!-- S'affiche apres que le résultat ait été trouvé -->
<div class="heading p-lg-3">
    <h3 class="heading-title text-uppercase mb-3">
        {titre}
    </h3>

    <div class="d-flex flex-column flex-lg-row align-items-center">
        {#if youtube}
            <a
                href={youtube}
                target="_blank"
                class="button-play btn btn-light btn-lg col-12 col-lg-auto"
            >
                <i class="bi bi-play-fill" />
                <span>Voir la bande annonce</span>
            </a>
        {/if}
        {#if id}
            <a
                href={Router.urlFor("details", { id })}
                class="button-infos btn btn-secondary btn-lg col-12 col-lg-auto ms-lg-3 my-3 my-lg-0"
            >
                <i class="bi bi-info-circle" />
                <span>Plus d'infos</span>
            </a>
        {/if}
    </div>
</div>
