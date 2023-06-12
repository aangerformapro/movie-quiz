<script>
    import url from "./utils/url";
    function handleLinkClick(e) {
        e.preventDefault();
        const href = e.target.href;
        history.pushState(href, "", href);
    }

    const base = (() => {
        let path = location.pathname,
            segments = path.split("/");

        segments.pop();

        return segments.join("/");
    })();

    function getRoute(path) {
        if (path.startsWith(base)) {
            return path.slice(base.length);
        }
        return path;
    }
</script>

<nav>
    <a href="./" on:click={handleLinkClick}>Home</a>
    <a href="./about" on:click={handleLinkClick}>About</a>
    <a href="./404" on:click={handleLinkClick}>404</a>
</nav>
{#if getRoute($url.pathname) === "/"}
    <h1>Home Sweet Home</h1>
{:else if getRoute($url.pathname) === "/about"}
    <h1>About What?</h1>
{:else}
    <h1>404</h1>
{/if}
