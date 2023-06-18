<script>
    import Loader from "./Loader.svelte";
    import { onDestroy, onMount } from "svelte";
    import Typed from "typed.js";
    import { isArray, isEmpty } from "../../modules/utils/utils.mjs";
    import { loading } from "../App/vars.mjs";

    import messages from "./loading-messages.mjs";

    export let phrase = [],
        loop = false,
        speed = 20;

    let toType, typed, unsub;

    onMount(() => {
        if (!isArray(phrase)) {
            phrase = [phrase];
        }

        if (isEmpty(phrase)) {
            for (let i = 0; i < 4; i++) {
                phrase.push(
                    messages[Math.floor(Math.random() * messages.length)]
                );
            }

            phrase.push(toType.innerText);
        }

        typed = new Typed(toType, {
            strings: phrase,
            typeSpeed: speed,
            backSpeed: Math.round(speed / 6),
            loop,
            loopCount: 5,
        });

        unsub = loading.subscribe((value) => {
            if (value === false) {
                typed.stop();
            } else {
                typed.start();
            }
        });
    });

    onDestroy(() => {
        unsub();
        typed.onDestroy();
    });
</script>

<div class="main-loader justify-content-evenly {$loading ? '' : 'd-none'}">
    <div class="background">
        <img src="./assets/pictures/moviequiz.webp" alt="" />
    </div>
    <Loader />
    <div class="">
        <span class="typed" bind:this={toType}>
            Veuillez patienter un instant ...
        </span>
    </div>
</div>
