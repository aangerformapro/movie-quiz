

import App from "./App.svelte";

const app = new App({
    target: document.body,
    props: {
        basepath: document.querySelector('base').getAttribute('href'),
        // url: ''
    }
});

export default app;

// import sass last to override the one loaded inside the app
import '../scss/app.scss';