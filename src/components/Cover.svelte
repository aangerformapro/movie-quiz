<script>
    import { noop } from "svelte/internal";
    import createResourceLoader from "../App/loader.mjs";
    import Heading from "./Heading.svelte";
    import { current } from "../App/game.mjs";

    export let more = true,
        force = false;

    const { onload } = createResourceLoader(noop);
</script>

<!-- Charge l'image du jeu -->
<div class="cover">
    <div class="background-picture position-relative">
        <img
            src={$current.cover.w1280}
            alt="affiche du film"
            class=""
            use:onload
        />
        <div class="blured" />
    </div>

    <Heading {more} {force} />
    <slot />
</div>
