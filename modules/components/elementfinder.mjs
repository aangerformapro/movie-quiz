


/**
 * Uses the mutation observer to look for elements
 * A small version of finder and future replacement
 */

import { isFunction, isValidSelector, document, isElement, runAsync } from "../utils/utils.mjs";





export default function ElementFinder(
    /** @type {string} */ selector,
    /** @type {function} */ fn,
    once = false,
    /** @type {HTMLElement|undefined} */ root
)
{


    if (!isValidSelector(selector))
    {
        throw new TypeError("Invalid selector");
    }

    if (!isFunction(fn))
    {
        throw new TypeError('fn is not a Function');
    }

    root ??= document.body;

    if (!isElement(root))
    {
        throw new TypeError('root is not an Element');
    }



    const
        matches = new Set(),
        controller = new AbortController(),
        signal = controller.signal,
        watcher = () =>
        {

            if (signal.aborted)
            {
                return;
            }

            for (let target of [...root.querySelectorAll(selector)])
            {
                if (signal.aborted)
                {
                    return;
                }

                // aborted inside the loop
                if (matches.has(target))
                {
                    continue;
                }
                matches.add(target);

                // non blocking
                runAsync(fn, target);
                if (once)
                {
                    controller.abort();
                    return;
                }
            }
        };


    signal.onabort = () =>
    {
        if (typeof observer !== 'undefined')
        {
            observer.disconnect();
        }
    };


    const observer = new MutationObserver(watcher);

    // we make an initial instant scan
    watcher();
    if (!signal.aborted)
    {
        // we use all mutations to trigger a scan
        observer.observe(root, {
            attributes: true, childList: true, subtree: true
        });
    }

    return () =>
    {
        if (!signal.aborted)
        {
            controller.abort();
        }
    };

}

ElementFinder.findOne = (selector, fn, root) =>
{
    return ElementFinder(selector, fn, true, root);
};

