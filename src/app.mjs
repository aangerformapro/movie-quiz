import App from "../app/App.svelte";
import LocalStore from "./stores/webstore.mjs";



const app = new App({
    target: document.querySelector('main'),
    // props: {
    // 	name: 'world'
    // }
});

export default app;


// LocalStore.setItem('name', { fjdjf: 10, ldjfjd: true });