<script>
    import { createDialog } from "../../modules/components/dialog.mjs";

    import "devicon";

    const { dialog, oncreateDialog } = createDialog({
        canCancel: false,
        canClose: false,
        backdropClose: false,
    });

    function handleClick() {
        dialog.showModal();
    }
</script>

<footer class="text-center p-3 mt-3">
    Une réalisation &copy; ACS Lons-le-Saunier - Mentions légales<br />
    <a href="#credits" title="Crédits" on:click|preventDefault={handleClick}>
        Crédits
    </a>
</footer>

<div class="dialog-contents mb-3" title="Crédits" use:oncreateDialog>
    <p class="m-0 p-0">
        Jeu développé par <a href="https://aanger.netlify.app/" target="_blank"
            >Aymeric Anger</a
        >, utilisant ces technologies:
    </p>
    <div class="icons d-flex align-items-center flex-wrap">
        <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="The Movie Database"
        >
            <i class="ng-tmdb" size="48" />
        </a>

        <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="NodeJS"
        >
            <i class="ng-node" size="96" />
        </a>

        <a
            href="https://svelte.dev/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Svelte"
        >
            <i class="ng-svelte" size="48" />
        </a>

        <a
            href="https://sass-lang.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="ScSS"
        >
            <i class="ng-sass" size="48" />
        </a>

        <a
            href="https://getbootstrap.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Bootstrap"
        >
            <i class="ng-bootstrap" size="48" />
        </a>

        <a
            href="https://mattboldt.com/demos/typed-js/"
            target="_blank"
            rel="noopener noreferrer"
            class="typedjs-icon hint--top hint--bounce hint--rounded"
            aria-label="Typed.js"
        >
            Typed.js
        </a>
        <a
            href="https://swiperjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Swiper"
        >
            <i class="ng-swiper" size="48" />
        </a>
        <a
            href="https://fonts.google.com/icons?icon.set=Material+Symbols"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Google Fonts + Material Icons"
        >
            <i class="ng-gfonts" size="48" />
        </a>
        <a
            href="https://devicon.dev/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="DevIcons"
        >
            <i class="ng-devicon" size="48" />
        </a>

        <a
            href="https://github.com/aangerformapro/movie-quiz"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Github"
        >
            <i class="ng-github-revert" size="48" />
        </a>
    </div>
</div>

<style lang="scss">
    .icons {
        a {
            min-width: 20%;
            margin: 8px 0;
            text-align: center;
            // width: 25%;
        }
        .typedjs-icon {
            color: #fff;
            text-shadow: #000 0px 2px 4px;
            user-select: none;
            text-decoration: none;
            font-size: 24px;
        }
    }
</style>
