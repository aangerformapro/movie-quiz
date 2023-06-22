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
            for (let i = 0; i < 15; i++) {
                phrase.push(
                    messages[Math.floor(Math.random() * messages.length)]
                );
            }

            phrase.push(toType.innerText);
        }

        const stop = () => {
            if (pleaseStop) {
                if (!typed.typingComplete) {
                    typed.stop();
                }

                setTimeout(() => {
                    NoScroll.disable(false).then(() => {
                        $loaderDisplayed = pleaseStop = false;
                        scrollTo(0, 0);
                    });
                }, 1200);
            }
        };

        typed = new Typed(toType, {
            strings: phrase,
            typeSpeed: speed,
            backSpeed: Math.round(speed / 6),
            loop,
            loopCount: 5,
            onStringTyped: stop,
            onComplete: stop,
        });

        unsub = loading.subscribe((value) => {
            if (false === (pleaseStop = !value)) {
                $loaderDisplayed = true;
                NoScroll.enable(false);
                typed.start();
            } else if (typed.typingComplete) {
                stop();
            }
        });
    });

    onDestroy(() => {
        unsub();
        typed.destroy();
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
