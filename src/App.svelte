<script>
    import { Router, Route, Link } from "svelte-navigator";
    import { onDestroy, onMount } from "svelte";

    import { loading } from "./components/mainloader.mjs";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import History from "../modules/components/history.mjs";
    import Home from "./pages/Home.svelte";

    const unlisten = History.onPush((e) => {
        if (e.type === "push") {
            $loading = true;
            // to be replaced by load events
            setTimeout(() => {
                $loading = false;
            }, 1500);
        }
    });

    onMount(() => {
        // to be replaced by load events
        setTimeout(() => {
            $loading = false;
        }, 5000);
    });

    onDestroy(() => {
        unlisten();
    });
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
    </main>
    <MainLoader />
    <Footer />
</Router>
