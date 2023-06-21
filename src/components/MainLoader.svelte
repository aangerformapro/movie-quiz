<script>
    import { onDestroy, onMount } from "svelte";
    import Typed from "typed.js";
    import { isArray, isEmpty } from "../../modules/utils/utils.mjs";
    import { loading, loaderDisplayed } from "../App/utils.mjs";
    import { fr as messages } from "../../modules/components/loading-messages.mjs";
    import NoScroll from "../../modules/components/noscroll.mjs";

    export let phrase = [],
        loop = false,
        speed = 20;

    let toType, typed, unsub, pleaseStop;

    onMount(() => {
        if (!isArray(phrase)) {
            phrase = [phrase];
        }

        if (isEmpty(phrase)) {
            for (let i = 0; i < 10; i++) {
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
            onStringTyped() {
                if (pleaseStop) {
                    typed.stop();
                    setTimeout(() => {
                        NoScroll.disable().then(() => {
                            $loaderDisplayed = pleaseStop = false;
                        });
                    }, 1200);
                }
            },
        });

        unsub = loading.subscribe((value) => {
            if (false === (pleaseStop = !value)) {
                $loaderDisplayed = true;
                NoScroll.enable();
                typed.start();
            }
        });
    });

    onDestroy(() => {
        unsub();
        typed.onDestroy();
    });
</script>

<div class="main-loader justify-content-evenly" hidden={!$loaderDisplayed}>
    <div class="background">
        <img src="./assets/pictures/moviequiz.webp" alt="" />
    </div>
    <div class="fluo">
        <span />
        <span />
        <span />
        <span />
    </div>
    <div class="load-message">
        <span class="typed" bind:this={toType}>
            Veuillez patienter, ça charge ...
        </span>
    </div>
</div>
