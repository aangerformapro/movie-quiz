<script>
    import { onDestroy, onMount } from "svelte";
    import Typed from "typed.js";
    import { isArray } from "../../modules/utils/utils.mjs";

    export let phrase = [
            `Veuillez patienter un instant ...`,
            `Chargement des médias ...`,
        ],
        loop = false,
        speed = 30,
        visible = true;

    let toType;

    onMount(() => {
        if (!isArray(phrase)) {
            phrase = [phrase];
        }

        const typed = new Typed(toType, {
            strings: phrase,
            typeSpeed: speed,
            backSpeed: Math.round(speed / 2),
            loop,
            loopCount: 2,
        });
    });

    onDestroy(() => {
        typed.onDestroy();
    });
</script>

<div class="main-loader justify-content-evenly {visible ? '' : 'd-none'}">
    <div class="background">
        <img src="./assets/pictures/moviequiz.webp" alt="" />
    </div>
    <div class="fluo">
        <span />
        <span />
        <span />
        <span />
    </div>
    <div class="">
        <span class="typed" bind:this={toType}>
            Veuillez patienter un instant ...
        </span>
    </div>
</div>
