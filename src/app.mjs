import History from "../modules/components/history.mjs";
import { watch as watchIcons } from "../modules/components/sprite.mjs";
import App from "./App.svelte";



const app = new App({
    target: document.body,
    props: {
        // url: ''
    }
});

export default app;

watchIcons();