<script>
    import Dialog from "../../modules/components/dialog.mjs";

    export const credits = new Dialog(
        `<p class="text-center">
            Jeu développé par <a href="https://aanger.netlify.app/" target="_blank">Aymeric Anger</a>, utilisant ces technologies:
        </p>`,
        `Crédits`
    );
    // credits.position = Position.BOTTOM;

    credits.canCancel = credits.canClose = credits.backdropCloses = false;

    function handleClick() {
        credits.showModal();
    }
</script>

<footer class="text-center p-3 mt-3">
    Une réalisation &copy; ACS Lons-le-Saunier - Mentions légales<br />
    <a href="#credits" title="Crédits" on:click|preventDefault={handleClick}>
        Crédits
    </a>
</footer>
