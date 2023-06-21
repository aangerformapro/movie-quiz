<script>
    import TVPage from "./pages/TVPage.svelte";
    import Details from "./pages/Details.svelte";
    import { Router, Route, Link } from "svelte-navigator";
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import Home from "./pages/Home.svelte";
    import { ready, current } from "./App/game.mjs";
    // auto replace i.ng-* by their svgs
    import { watch as watchIcons } from "../modules/components/sprite.mjs";

    import { autoLoadAlternatives } from "../modules/utils/webp.mjs";
    import MoviesPage from "./pages/MoviesPage.svelte";

    watchIcons();

    autoLoadAlternatives();

    // $: console.debug("current", $current);
</script>

{#if $ready}
    <Router>
        <Header />
        <main id="app">
            <Route path="/">
                <Home />
            </Route>

            <Route path="tv/:id">
                <TVPage />
            </Route>
            <Route path="tv/*">
                <TVPage />
            </Route>

            <Route path="movies/:id">
                <MoviesPage />
            </Route>
            <Route path="movies/*">
                <MoviesPage />
            </Route>

            <Route path="all/:id">
                <h1>All</h1>
            </Route>
            <Route path="all/*">
                <h1>All</h1>
            </Route>

            <Route path="details/:id">
                <Details />
            </Route>
            <Route path="*">
                <div
                    class="position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center text-danger fs-1 fw-bolder user-select-none"
                >
                    OOPS
                </div>
            </Route>
        </main>
        <Footer />
    </Router>
{/if}

<MainLoader />
