import { writable } from "svelte/store";

/**
 * Toggle loading screen
 */
export const loading = writable(false);


/**
 * Change Cover url
 */

export const cover = writable('');
export const coverIsLoaded = writable(false);



/**
 * Watch for load events on multiple targets
 */
export const createLoadObserver = handler =>
{
    let waiting = 0;

    const onload = el =>
    {
        waiting++;
        el.addEventListener('load', () =>
        {
            waiting--;

            // if loading same asset multiple times
            // waiting = Math.max(0, waiting);

            if (waiting === 0)
            {
                handler();
            }
        });
    };

    return onload;
};