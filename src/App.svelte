<script>
    import { Router, Route, Link } from "svelte-navigator";
    import { onDestroy, onMount } from "svelte";

    import { loading } from "./App/vars.mjs";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import History from "../modules/components/history.mjs";

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
    <main id="app" />
    <MainLoader />
    <Footer />
</Router>
