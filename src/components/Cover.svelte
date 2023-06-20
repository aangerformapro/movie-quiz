<script>
    import { onDestroy } from "svelte";
    import {
        cover as src,
        coverIsLoaded,
        createLoadObserver,
    } from "../App/utils.mjs";

    // import { current } from "../App/game.mjs";

    import Heading from "./Heading.svelte";

    export let item = {};

    const unsub = src.subscribe(() => ($coverIsLoaded = false));

    const onload = createLoadObserver(() => {
        $coverIsLoaded = true;
    });

    onDestroy(() => {
        unsub();
    });

    // $: $src = $current.cover.w1280;
</script>

<Heading force="true" item={$current} />

<!-- Charge l'image du jeu -->
<div class="cover">
    <div class="background-picture position-relative">
        <img src={$src} use:onload alt="affiche du film" class="" />
        {#if !$coverIsLoaded}
            <div class="cover-loading" />
        {/if}
        <div class="blured" />
    </div>
</div>
