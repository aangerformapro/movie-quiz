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
    import { ready } from "./App/game.mjs";

    // auto replace i.ng-* by their svgs
    import "../modules/components/sprite.mjs";
    import { autoLoadAlternatives } from "../modules/utils/webp.mjs";
    import RouteRedirect from "./components/RouteRedirect.svelte";
    import All from "./pages/All.svelte";
    import Player from "./components/Player.svelte";
    import Intro from "./components/Intro.svelte";
    import Offline from "./pages/Offline.svelte";

    autoLoadAlternatives();

    export let basepath = "";
</script>

{#if $ready}
    <Router {basepath}>
        <Route path="intro">
            <Intro force={true} animated={false} />
        </Route>
        <Header />
        <main id="app">
            <Route path="/">
                <Home />
            </Route>
            <Route path="/index.html">
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
        <Player />
        <Intro />
        <Footer />
    </Router>
{/if}

<MainLoader />

<Offline />
