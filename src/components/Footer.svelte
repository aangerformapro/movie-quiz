<script>
    import { createDialog } from "../../modules/components/dialog.mjs";

    const { dialog, oncreateDialog } = createDialog({
        canCancel: false,
        canClose: false,
        backdropClose: false,
    });

    function handleClick() {
        dialog.showModal();
    }
</script>

<footer class="text-center p-3 mt-3">
    Une réalisation &copy; ACS Lons-le-Saunier - Mentions légales<br />
    <a href="#credits" title="Crédits" on:click|preventDefault={handleClick}>
        Crédits
    </a>
</footer>

<div class="dialog-contents mb-3" title="Crédits" use:oncreateDialog>
    <p class="m-0 p-0">
        Jeu développé par <a href="https://aanger.netlify.app/" target="_blank"
            >Aymeric Anger</a
        >, utilisant ces technologies:
    </p>
    <div class="icons d-flex align-items-center flex-wrap">
        <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="The Movie Database"
        >
            <svg
                width="48"
                height="48"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 190.24 81.52"
                ><defs
                    ><style>
                        .cls-1 {
                            fill: url(#linear-gradient);
                        }
                    </style><linearGradient
                        id="linear-gradient"
                        y1="40.76"
                        x2="190.24"
                        y2="40.76"
                        gradientUnits="userSpaceOnUse"
                        ><stop offset="0" stop-color="#90cea1" /><stop
                            offset="0.56"
                            stop-color="#3cbec9"
                        /><stop
                            offset="1"
                            stop-color="#00b3e5"
                        /></linearGradient
                    ></defs
                ><title>Asset 2</title><g id="Layer_2" data-name="Layer 2"
                    ><g id="Layer_1-2" data-name="Layer 1"
                        ><path
                            class="cls-1"
                            d="M105.67,36.06h66.9A17.67,17.67,0,0,0,190.24,18.4h0A17.67,17.67,0,0,0,172.57.73h-66.9A17.67,17.67,0,0,0,88,18.4h0A17.67,17.67,0,0,0,105.67,36.06Zm-88,45h76.9A17.67,17.67,0,0,0,112.24,63.4h0A17.67,17.67,0,0,0,94.57,45.73H17.67A17.67,17.67,0,0,0,0,63.4H0A17.67,17.67,0,0,0,17.67,81.06ZM10.41,35.42h7.8V6.92h10.1V0H.31v6.9h10.1Zm28.1,0h7.8V8.25h.1l9,27.15h6l9.3-27.15h.1V35.4h7.8V0H66.76l-8.2,23.1h-.1L50.31,0H38.51ZM152.43,55.67a15.07,15.07,0,0,0-4.52-5.52,18.57,18.57,0,0,0-6.68-3.08,33.54,33.54,0,0,0-8.07-1h-11.7v35.4h12.75a24.58,24.58,0,0,0,7.55-1.15A19.34,19.34,0,0,0,148.11,77a16.27,16.27,0,0,0,4.37-5.5,16.91,16.91,0,0,0,1.63-7.58A18.5,18.5,0,0,0,152.43,55.67ZM145,68.6A8.8,8.8,0,0,1,142.36,72a10.7,10.7,0,0,1-4,1.82,21.57,21.57,0,0,1-5,.55h-4.05v-21h4.6a17,17,0,0,1,4.67.63,11.66,11.66,0,0,1,3.88,1.87A9.14,9.14,0,0,1,145,59a9.87,9.87,0,0,1,1,4.52A11.89,11.89,0,0,1,145,68.6Zm44.63-.13a8,8,0,0,0-1.58-2.62A8.38,8.38,0,0,0,185.63,64a10.31,10.31,0,0,0-3.17-1v-.1a9.22,9.22,0,0,0,4.42-2.82,7.43,7.43,0,0,0,1.68-5,8.42,8.42,0,0,0-1.15-4.65,8.09,8.09,0,0,0-3-2.72,12.56,12.56,0,0,0-4.18-1.3,32.84,32.84,0,0,0-4.62-.33h-13.2v35.4h14.5a22.41,22.41,0,0,0,4.72-.5,13.53,13.53,0,0,0,4.28-1.65,9.42,9.42,0,0,0,3.1-3,8.52,8.52,0,0,0,1.2-4.68A9.39,9.39,0,0,0,189.66,68.47ZM170.21,52.72h5.3a10,10,0,0,1,1.85.18,6.18,6.18,0,0,1,1.7.57,3.39,3.39,0,0,1,1.22,1.13,3.22,3.22,0,0,1,.48,1.82,3.63,3.63,0,0,1-.43,1.8,3.4,3.4,0,0,1-1.12,1.2,4.92,4.92,0,0,1-1.58.65,7.51,7.51,0,0,1-1.77.2h-5.65Zm11.72,20a3.9,3.9,0,0,1-1.22,1.3,4.64,4.64,0,0,1-1.68.7,8.18,8.18,0,0,1-1.82.2h-7v-8h5.9a15.35,15.35,0,0,1,2,.15,8.47,8.47,0,0,1,2.05.55,4,4,0,0,1,1.57,1.18,3.11,3.11,0,0,1,.63,2A3.71,3.71,0,0,1,181.93,72.72Z"
                        /></g
                    ></g
                ></svg
            >
        </a>

        <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="NodeJS"
        >
            <i class="ng-node" size="96" />
        </a>

        <a
            href="https://svelte.dev/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Svelte"
        >
            <i class="ng-svelte" size="48" />
        </a>

        <a
            href="https://sass-lang.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="ScSS"
        >
            <i class="ng-sass" size="48" />
        </a>

        <a
            href="https://getbootstrap.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Bootstrap"
        >
            <svg viewBox="0 0 128 128" width="48" height="48">
                <defs
                    ><linearGradient
                        id="bootstrap-original-wordmark-a"
                        x1="76.079"
                        x2="523.48"
                        y1="10.798"
                        y2="365.95"
                        gradientTransform="translate(1.11 2.051) scale(.24566)"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#9013fe" offset="0" /><stop
                            stop-color="#6610f2"
                            offset="1"
                        /></linearGradient
                    ><linearGradient
                        id="bootstrap-original-wordmark-b"
                        x1="193.51"
                        x2="293.51"
                        y1="109.74"
                        y2="278.87"
                        gradientTransform="translate(0 52)"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#fff" offset="0" /><stop
                            stop-color="#f1e5fc"
                            offset="1"
                        /></linearGradient
                    ><filter
                        id="bootstrap-original-wordmark-c"
                        x="161.9"
                        y="135.46"
                        width="197"
                        height="249"
                        color-interpolation-filters="sRGB"
                        filterUnits="userSpaceOnUse"
                        ><feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        /><feColorMatrix
                            in="SourceAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        /><feOffset dy="4" /><feGaussianBlur
                            stdDeviation="8"
                        /><feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                        /><feBlend
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        /><feBlend
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        /></filter
                    ></defs
                ><path
                    d="M14.985 15.15c-.237-6.815 5.072-13.099 12.249-13.099h73.54c7.177 0 12.486 6.284 12.249 13.099-.228 6.546.068 15.026 2.202 21.94 2.141 6.936 5.751 11.319 11.664 11.883v6.387c-5.913.563-9.523 4.947-11.664 11.883-2.134 6.914-2.43 15.394-2.202 21.94.237 6.815-5.072 13.098-12.249 13.098h-73.54c-7.177 0-12.486-6.284-12.249-13.098.228-6.546-.068-15.026-2.203-21.94-2.14-6.935-5.76-11.319-11.673-11.883v-6.387c5.913-.563 9.533-4.947 11.673-11.883 2.135-6.914 2.43-15.394 2.203-21.94z"
                    fill="url(#bootstrap-original-wordmark-a)"
                /><path
                    transform="translate(1.494 -10.359) scale(.24566)"
                    d="M267.1 364.46c47.297 0 75.798-23.158 75.798-61.355 0-28.873-20.336-49.776-50.532-53.085v-1.203c22.185-3.609 39.594-24.211 39.594-47.219 0-32.783-25.882-54.138-65.322-54.138h-88.74v217zm-54.692-189.48h45.911c24.958 0 39.131 11.128 39.131 31.279 0 21.505-16.484 33.535-46.372 33.535h-38.67zm0 161.96v-71.431h45.602c32.661 0 49.608 12.03 49.608 35.49 0 23.459-16.484 35.941-47.605 35.941z"
                    fill="url(#bootstrap-original-wordmark-b)"
                    filter="url(#bootstrap-original-wordmark-c)"
                    stroke="#fff"
                /><text
                    x="9.073"
                    y="121.431"
                    fill="#7952b3"
                    font-family="'Segoe UI'"
                    font-size="25.333"
                    style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25"
                    ><tspan
                        x="9.073"
                        y="121.431"
                        style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal"
                        >Bootstrap</tspan
                    ></text
                >
            </svg>
        </a>

        <a
            href="https://mattboldt.com/demos/typed-js/"
            target="_blank"
            rel="noopener noreferrer"
            class="typedjs-icon hint--top hint--bounce hint--rounded"
            aria-label="Typed.js"
        >
            Typed.js
        </a>
        <a
            href="https://swiperjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Swiper"
        >
            <i class="ng-swiper" size="48" />
        </a>
        <a
            href="https://fonts.google.com/icons?icon.set=Material+Symbols"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Google Fonts + Material Icons"
        >
            <i class="ng-gfonts" size="48" />
        </a>
        <a
            href="https://devicon.dev/"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="DevIcons"
        >
            <i class="ng-devicon" size="48" />
        </a>

        <a
            href="https://github.com/aangerformapro/movie-quiz"
            target="_blank"
            rel="noopener noreferrer"
            class="hint--top hint--bounce hint--rounded"
            aria-label="Github"
        >
            <i class="ng-github-revert" size="48" />
        </a>
    </div>
</div>

<style lang="scss">
    .icons {
        a {
            min-width: 20%;
            margin: 8px 0;
            text-align: center;
        }
        .typedjs-icon {
            color: #fff;
            text-shadow: #000 0px 2px 4px;
            user-select: none;
            text-decoration: none;
            font-size: 24px;
        }
        .hint--top::after {
            font-family: "Poppins", sans-serif;
            font-size: 16px;
        }
    }
</style>
