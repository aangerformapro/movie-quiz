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
        <span class="fluo-color" />
        <span class="fluo-color" />
        <span class="fluo-color" />
        <span class="fluo-color" />
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
            fill="currentColor"
            width="24"
            height="24"
            enable-background="new 0 0 1000 1000"
            xml:space="preserve"
        >
            <path
                d="M500,10C229.8,10,10,229.8,10,500c0,270.2,219.8,490,490,490c270.2,0,490-219.8,490-490C990,229.8,770.2,10,500,10z M500,943.3C255.5,943.3,56.7,744.5,56.7,500S255.5,56.7,500,56.7c244.4,0,443.3,198.9,443.3,443.3S744.5,943.3,500,943.3z M500,434.1c-36.4,0-65.9,29.5-65.9,65.9c0,36.4,29.5,65.9,65.9,65.9c36.4,0,65.9-29.5,65.9-65.9C565.9,463.6,536.4,434.1,500,434.1z M500,325.5c58.2,0,105.5-47.3,105.5-105.5c0-58.2-47.3-105.5-105.5-105.5c-58.2,0-105.5,47.3-105.5,105.5C394.5,278.2,441.8,325.5,500,325.5z M500,161.2c32.5,0,58.8,26.4,58.8,58.9c0,32.5-26.4,58.8-58.8,58.8c-32.5,0-58.9-26.4-58.9-58.8C441.1,187.5,467.5,161.2,500,161.2z M336.7,627.8c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5s105.5-47.3,105.5-105.5C442.2,675.1,394.9,627.8,336.7,627.8z M336.7,792.2c-32.5,0-58.8-26.4-58.8-58.8c0-32.5,26.4-58.9,58.8-58.9s58.8,26.4,58.8,58.9C395.5,765.8,369.1,792.2,336.7,792.2z M663.3,627.8c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5c58.2,0,105.5-47.3,105.5-105.5C768.8,675.1,721.5,627.8,663.3,627.8z M663.3,792.2c-32.5,0-58.9-26.4-58.9-58.8c0-32.5,26.4-58.9,58.9-58.9c32.5,0,58.8,26.4,58.8,58.9C722.2,765.8,695.8,792.2,663.3,792.2z M780,324.5c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5c58.2,0,105.5-47.3,105.5-105.5C885.5,371.9,838.2,324.5,780,324.5z M780,488.8c-32.5,0-58.8-26.4-58.8-58.8c0-32.5,26.4-58.9,58.8-58.9c32.5,0,58.8,26.4,58.8,58.9C838.8,462.5,812.5,488.8,780,488.8z M325.5,430c0-58.2-47.3-105.5-105.5-105.5c-58.2,0-105.5,47.3-105.5,105.5S161.8,535.5,220,535.5C278.2,535.5,325.5,488.2,325.5,430z M220,488.8c-32.5,0-58.9-26.4-58.9-58.8c0-32.5,26.4-58.8,58.9-58.8s58.8,26.4,58.8,58.9C278.8,462.5,252.5,488.8,220,488.8z"
            />
        </svg>
    </div>
    <div class="load-message">
        <span class="typed" bind:this={toType}>
            Veuillez patienter, ça charge ...
        </span>
    </div>
</div>
