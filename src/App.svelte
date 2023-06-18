<script>
    import { Router, Route, Link } from "svelte-navigator";
    import { onDestroy } from "svelte";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import History from "../modules/components/history.mjs";

    let visible = true;

    // to be replaced by load events
    setTimeout(() => {
        visible = false;
    }, 5000);

    const unlisten = History.onPush((e) => {
        if (e.type === "push") {
            visible = true;
            // to be replaced by load events
            setTimeout(() => {
                visible = false;
            }, 500);
        }
    });

    onDestroy(() => {
        unlisten();
    });
</script>

<Router>
    <Header />
    <main id="app" />
    <MainLoader {visible} />
    <Footer />
</Router>
