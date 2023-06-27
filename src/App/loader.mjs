/**
 * Load Resources observer
 */

import { writable, get } from "svelte/store";
import { isElement, isFunction } from "../../modules/utils/utils.mjs";
import emitter from "../../modules/utils/emitter.mjs";
import { noop } from "svelte/internal";



function checkValid(el)
{
    if (!isElement(el) || !el.hasAttribute('src'))
    {

        throw new TypeError("invalid resource Element, no src attribute found");

    }
}

/**
 * Global Asset Loading Count
 */
export const loading = writable(0);


export const errors = writable(0);


const loadedUrls = new Set();

export default function createResourceLoader(fn = noop, triggerChange = false)
{
    if (!isFunction(fn))
    {
        throw new TypeError("fn is not a Function");
    }


    let count = 0;

    const waiting = writable(0);


    function increment(value = 1)
    {
        count += value;
        loading.update(val => val + value);
        waiting.update(val => val + value);
    }


    function decrement(value = 1)
    {
        increment(value * -1);
    }


    function onload(el)
    {

        checkValid(el);

        increment();

        let src = el.src;

        const observer = new MutationObserver(() =>
        {

            if (src !== el.src)
            {
                src = el.src;
                if (triggerChange)
                {
                    emitter(el).trigger("change");
                }
                increment();
            }
        });

        observer.observe(el, { attributeFilter: ['src'] });

        const listener = () =>
        {

            // if (!loadedUrls.has(el.src))
            // {
            //     errors.set(0);
            // }


            decrement();

            loadedUrls.add(el.src);

            if (count === 0)
            {
                fn();
            }
        }, errorListener = () =>
        {
            errors.update(val => val + 1);
            decrement();
            if (count === 0)
            {
                fn();
            }
        };




        emitter(el).on('load', listener);
        emitter(el).on("error", errorListener);



        return {
            onDestroy()
            {
                observer.disconnect();
                emitter.off('load', listener);
                emitter(el).off("error", errorListener);
                decrement();
            }
        };
    }

    return {
        waiting, onload
    };

}







