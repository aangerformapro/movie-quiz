<script>
    import { onDestroy } from "svelte";
    import SoundTrack, { playIntro } from "../App/audio.mjs";

    export let force = false,
        animated = true;
    onDestroy(
        playIntro.subscribe((value) => {
            if (value === true) {
                setTimeout(() => {
                    $playIntro = false;
                }, 4200);
                SoundTrack.INTRO.play().catch(console.warn);
            }
        })
    );
</script>

{#if $playIntro || force}
    <div class="intro {animated ? 'intro-animated' : ''}">
        <div class="logo-big">
            <img src="./assets/pictures/moviequiz.webp" alt="MovieQuiz" />
        </div>
    </div>
{/if}

<style lang="scss">
    .intro {
        position: fixed;
        z-index: 6000;
        inset: 0;
        background: var(--netflix-black);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        .logo-big {
            max-width: 90vw;

            img {
                object-fit: cover;
                object-position: center center;
                max-width: 100%;
            }
        }

        &.intro-animated {
            animation: fadeOut 1s ease-out forwards 3s;

            .logo-big {
                transform: scale(0.3);
                animation: zoomOut 3s ease forwards;
            }
        }
        @keyframes fadeOut {
            to {
                opacity: 0;
                z-index: -1;
            }
        }

        @keyframes zoomOut {
            from {
                transform: scale(0.3);
            }
            33% {
                transform: scale(1.3);
            }

            to {
                transform: scale(0.1);
            }
        }
    }
</style>
