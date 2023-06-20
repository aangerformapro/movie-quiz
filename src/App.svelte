<script>
    import Details from "./pages/Details.svelte";
    import { Router, Route, Link } from "svelte-navigator";
    import { loading } from "./App/utils.mjs";
    import { loading as rload } from "./App/loader.mjs";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import Home from "./pages/Home.svelte";
    import { ready, current } from "./App/game.mjs";
    // auto replace i.ng-* by their svgs
    import { watch as watchIcons } from "../modules/components/sprite.mjs";
    watchIcons();

    // magic loading screen
    $: $loading = !$ready || $rload > 0;

    $: console.debug("current", $current);
</script>

<Router>
    <Header />
    <main id="app">
        <Route path="/">
            <Home />
        </Route>
        <Route path="tv/*">
            <h1>Séries</h1>
        </Route>
        <Route path="movies/*">
            <h1>Movies</h1>
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
    <MainLoader />
    <Footer />
</Router>
