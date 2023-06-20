<script>
    import Loader from "./Loader.svelte";
    import { onDestroy, onMount } from "svelte";
    import Typed from "typed.js";
    import { isArray, isEmpty } from "../../modules/utils/utils.mjs";
    import { loading } from "../App/utils.mjs";

    import messages from "../../modules/components/loading-messages.mjs";

    export let phrase = [],
        loop = false,
        speed = 20;

    let toType, typed, unsub, elem;

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
            onStringTyped() {
                if (pleaseStop) {
                    typed.stop();
                    setTimeout(() => {
                        elem.classList.add("d-none");
                    }, 200);
                }
            },
        });

        let pleaseStop = false;

        unsub = loading.subscribe((value) => {
            if (false === (pleaseStop = !value)) {
                typed.start();
                elem.classList.remove("d-none");
            }
        });
    });

    onDestroy(() => {
        unsub();
        typed.onDestroy();
    });
</script>

<div class="main-loader justify-content-evenly" bind:this={elem}>
    <div class="background">
        <img src="./assets/pictures/moviequiz.webp" alt="" />
    </div>
    <Loader />
    <div class="">
        <span class="typed" bind:this={toType}>
            Veuillez patienter, ça charge ...
        </span>
    </div>
</div>
