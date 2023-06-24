<script>
    import { links } from "svelte-navigator";
    import { NOPIC } from "../../App/game.mjs";
    import createResourceLoader from "../../App/loader.mjs";

    export let href = "",
        cover,
        found = "",
        title = "";

    const { onload } = createResourceLoader();
</script>

<div class="poster flat m-2 {found}">
    {#if title}<div class="title">{title}</div>{/if}
    <a {href} use:links>
        <img src={cover ?? NOPIC} alt="Poster Media" use:onload />
    </a>
</div>
