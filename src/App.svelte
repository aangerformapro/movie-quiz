<script>
    import { Router, Route, Link } from "svelte-navigator";

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";

    // export let url = "";
</script>

<Router>
    <Header />
    <main id="app" />
    <Footer />
</Router>
