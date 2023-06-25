<script>
    import "hint.css/hint.min.css";
    import { links, useLocation } from "svelte-navigator";
    import createResourceLoader from "../App/loader.mjs";
    import {
        Position,
        createDialog,
    } from "../../modules/components/dialog.mjs";
    import NoScroll from "../../modules/components/noscroll.mjs";
    import { beforeUpdate, onDestroy } from "svelte/internal";
    import { WinningStreak } from "../App/game.mjs";
    const { onload } = createResourceLoader();

    const { oncreateDialog, dialog: regles } = createDialog({
        canCancel: false,
        position: Position.TOP,
    });

    function showModal() {
        regles.showModal();
    }

    let burger;

    function handleBurgerChange() {
        if (burger.checked) {
            NoScroll.enable();
        } else {
            NoScroll.disable();
        }
    }

    /**
     * Resize listener
     */
    const breakpoint = matchMedia("(max-width: 992px)");

    breakpoint.addEventListener("change", (e) => {
        if (!e.matches) {
            burger.checked = false;

            if (!regles?.open) {
                NoScroll.disable(false);
            }
        }
    });

    NoScroll.on("disabled", (e) => {
        if (burger.checked && breakpoint.matches) {
            NoScroll.enable(false);
        }
    });

    function navClick(e) {
        let a = e.target.closest("a");

        if (a && breakpoint.matches) {
            burger.checked = false;
        }
    }

    const loc = useLocation();

    const navLinks = new Set();

    function active(el) {
        navLinks.add(el);
        const href = el.getAttribute("href");
        if (
            $loc.pathname.slice(1).startsWith(href + "/") ||
            $loc.pathname === href
        ) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    }

    beforeUpdate(() => {
        navLinks.forEach(active);
    });

    onDestroy(() => {
        navLinks.clear();
    });
</script>

<header class="user-select-none">
    <div
        class="nav-container w-100 d-flex align-items-center px-2 px-md-5"
        id="top"
    >
        <a class="logo" href="/" title="Movie Quiz">
            <img
                src="./assets/pictures/m.webp"
                width="32"
                height="32"
                alt="Movie Quiz Logo Mini"
                class="d-md-none"
                use:onload
            />
            <img
                src="./assets/pictures/moviequiz.webp"
                height="32"
                width="126"
                alt="Movie Quiz Logo"
                class="d-none d-md-inline-block"
                use:onload
            />
        </a>
        <input
            type="checkbox"
            id="burger-btn"
            name="burger-btn"
            title="Burger Button Checkbox"
            class=""
            on:change={handleBurgerChange}
            bind:this={burger}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <nav
            class="nav flex-column flex-lg-row justify-content-center"
            on:click={navClick}
        >
            <a class="nav-link" href="/" use:active use:links> Accueil </a>
            <a href="tv" class="nav-link" use:active use:links> Séries </a>
            <a href="movies" class="nav-link" use:active use:links>Films</a>
            <a href="all" class="nav-link" use:active use:links>
                Tous les films et séries
            </a>
        </nav>

        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
            class="info-btn ms-auto my-2 d-flex align-items-center"
            href="#"
            on:click|preventDefault={showModal}
        >
            <i class="ng-help" size="24" />
            <span class="hide-on-mobile ms-1">Comment Jouer</span>
        </a>

        <div
            class="winning-streak m-2 hint--bottom hint--bounce hint--rounded"
            aria-label="Winning Streak"
        >
            <i class="ng-emoji-events" size="24" />
            <span class="count ms-2">{$WinningStreak}</span>
        </div>

        <label for="burger-btn" class="burger-btn ms-3 mobile-only">
            <div class="burger" />
        </label>
    </div>
</header>

<div class="rules" title="Comment Jouer" use:oncreateDialog>
    <p class="text-center">
        Le joueur doit deviner les noms de films et de séries à partir d'images
        grisées<br />
        en tapant le nom dans la zone dédiée.
    </p>
</div>

<style lang="scss">
    .winning-streak {
        display: flex;
        align-items: center;
        font-size: 18px;
        line-height: 24px;
        font-weight: 400;
        cursor: pointer;
        &::after {
            font-family: "Poppins", sans-serif;
            font-size: 16px;
        }
    }
</style>
