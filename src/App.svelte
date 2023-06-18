<script>
    import { Router, Route, Link } from "svelte-navigator";
    import { onDestroy } from "svelte";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import MainLoader from "./components/MainLoader.svelte";
    import History from "../modules/components/history.mjs";

    let visible = true;

    setTimeout(() => {
        visible = false;
    }, 5000);

    const unlisten = History.onPush(console.debug);

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
