import History, { RouterEvent } from "../modules/components/history.mjs";
import { watch as watchIcons } from "../modules/components/sprite.mjs";
import App from "./App.svelte";


History.start(RouterEvent.PUSH);

const app = new App({
    target: document.body,
    props: {
        // url: ''
    }
});

export default app;

watchIcons();