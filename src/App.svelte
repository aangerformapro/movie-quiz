<script>
    import TV from "./pages/TV.svelte";
    import Details from "./pages/Details.svelte";
    import { Router, Route } from "svelte-navigator";
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import Home from "./pages/Home.svelte";
    import { ready, current } from "./App/game.mjs";

    // auto replace i.ng-* by their svgs
    import { watch as watchIcons } from "../modules/components/sprite.mjs";
    import { autoLoadAlternatives } from "../modules/utils/webp.mjs";
    import Movie from "./pages/Movie.svelte";
    import NotFound from "./pages/NotFound.svelte";
    watchIcons();
    autoLoadAlternatives();
</script>

{#if $ready}
    <Router>
        <Header />
        <main id="app">
            <Route path="/">
                <Home />
            </Route>

            <Route path="tv/:id">
                <TV />
            </Route>

            <Route path="tv/*">
                <TV />
            </Route>

            <Route path="movies/:id">
                <Movie />
            </Route>
            <Route path="movies/*">
                <Movie />
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
                <NotFound />
            </Route>
        </main>
        <Footer />
    </Router>
{/if}

<MainLoader />
