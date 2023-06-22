<script>
    import { onDestroy } from "svelte";
    import { playIntro } from "../App/audio.mjs";

    onDestroy(
        playIntro.subscribe((value) => {
            if (value === true) {
                setTimeout(() => {
                    $playIntro = false;
                }, 4200);
            }
        })
    );
</script>

{#if $playIntro}
    <div class="intro">
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
        // flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        animation: fadeOut 1s ease-out forwards 3s;

        .logo-big {
            max-width: 90vw;
            transform: scale(0.3);
            animation: zoomOut 3s ease forwards;
            img {
                object-fit: cover;
                object-position: center center;
                max-width: 100%;
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
