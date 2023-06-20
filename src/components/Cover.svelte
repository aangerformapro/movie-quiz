<script>
    import { noop } from "svelte/internal";
    import createResourceLoader, { loading } from "../App/loader.mjs";
    import Heading from "./Heading.svelte";

    export let item = {};

    const { onload } = createResourceLoader(noop);
</script>

<Heading force="true" {item} />

<!-- Charge l'image du jeu -->
<div class="cover">
    <div class="background-picture position-relative">
        <img src={item.cover.w1280} alt="affiche du film" class="" use:onload />
        <div class="blured" />
    </div>
</div>
