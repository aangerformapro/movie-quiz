/**
 * Load Resources observer
 */

import { writable, readable, get, derived } from "svelte/store";
import { isElement, isFunction } from "../../modules/utils/utils.mjs";
import emitter from "../../modules/utils/emitter.mjs";



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


export default function createResourceLoader(fn, triggerChange = false)
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
            decrement();
            if (count === 0)
            {
                fn();
            }
        };


        emitter(el).on('load', listener);

        return {
            onDestroy()
            {
                observer.disconnect();
                emitter.off('load', listener);
                decrement();
            }
        };
    }

    return {
        waiting, onload,
    };

}







