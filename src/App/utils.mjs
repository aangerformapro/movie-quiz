import { writable, get, derived } from "svelte/store";
import { ready } from "./game.mjs";
import { loading as rload } from "./loader.mjs";




/**
 * Toggle loading screen
 */
export const loading = derived([ready, rload], ([$ready, $rload]) =>
{
    return !$ready || $rload > 0;
});

export const loaderDisplayed = writable(true);
