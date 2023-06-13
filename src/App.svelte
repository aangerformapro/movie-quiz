<script>
    import url, { getRoute } from "./utils/url";
    function handleLinkClick(e) {
        e.preventDefault();
        const href = e.target.href;
        history.pushState(href, "", href);
    }
</script>

<nav>
    <a href="./" on:click={handleLinkClick}>Home</a>
    <a href="./about.html" on:click={handleLinkClick}>About</a>
    <a href="./404" on:click={handleLinkClick}>404</a>
</nav>
{#if getRoute($url.pathname) === "/"}
    <h1>Home Sweet Home</h1>
{:else if getRoute($url.pathname) === "/about.html"}
    <h1>About What?</h1>
{:else}
    <h1>404</h1>
{/if}
