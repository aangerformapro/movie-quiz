
import { writable } from "svelte/store";


/**
 * Change image url
 */

export const cover = writable('./assets/pictures/heading.webp');
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
            if (waiting <= 0)
            {
                handler();
            }
        });
    };

    return onload;
};