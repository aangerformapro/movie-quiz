<script>
    import TV from "./pages/TV.svelte";
    import Movie from "./pages/Movie.svelte";
    import NotFound from "./pages/NotFound.svelte";
    import Details from "./pages/Details.svelte";
    import { Router, Route } from "svelte-navigator";
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import Home from "./pages/Home.svelte";
    import {
        MediaType,
        all,
        getNotFound,
        getRandom,
        movies,
        ready,
        tv,
    } from "./App/game.mjs";
    import { useNavigate } from "svelte-navigator";

    // auto replace i.ng-* by their svgs
    import { watch as watchIcons } from "../modules/components/sprite.mjs";
    import { autoLoadAlternatives } from "../modules/utils/webp.mjs";
    import RouteRedirect from "./components/RouteRedirect.svelte";
    import All from "./pages/All.svelte";

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

            <Route path="tv">
                <RouteRedirect />
            </Route>

            <Route path="movies/:id">
                <Movie />
            </Route>
            <Route path="movies">
                <RouteRedirect />
            </Route>

            <Route path="all/:id">
                <All />
            </Route>
            <Route path="all">
                <RouteRedirect />
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
