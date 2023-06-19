<script>
    import { onDestroy } from "svelte";
    import {
        cover as src,
        coverIsLoaded,
        createLoadObserver,
    } from "./cover.mjs";

    const unsub = src.subscribe(() => ($coverIsLoaded = false));

    const onload = createLoadObserver(() => {
        $coverIsLoaded = true;
    });

    onDestroy(() => {
        unsub();
    });
</script>

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
