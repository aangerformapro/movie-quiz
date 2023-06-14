<script>
    import { href, route } from "./App/routes.mjs";
    import Home from "./pages/Home.svelte";
    import Movies from "./pages/Movies.svelte";
    import Tv from "./pages/Tv.svelte";
    import Both from "./pages/Both.svelte";
    import Details from "./pages/Details.svelte";

    import Game from "./pages/Game.svelte";

    $: console.dir($route);
</script>

{#if $route.name === "home"}
    <Home />
{:else if $route.name === "movies"}
    <Movies />
{:else if $route.name === "tv"}
    <Tv />
{:else if $route.name === "both"}
    <Both />
{:else if $route.name === "details"}
    <Details />
{:else if $route.name === "game"}
    <Game />
{:else}
    <h1 class="text-danger">OOPS!!</h1>
{/if}
