/**
 * Listen to navigator history
 */

import emitter from "./emitter.mjs";
import { BackedEnum, getUrl, isFunction } from "./utils.mjs";








export default class HistoryEvent extends BackedEnum
{

    static PUSH = new HistoryEvent('push');
    static REPLACE = new HistoryEvent('replace');
    static POP = new HistoryEvent('pop');
    static HASH = new HistoryEvent('hash');


    listen(fn)
    {
        if (!isFunction(fn))
        {
            throw new TypeError("fn is not a Function");
        }

        const listeners = EventListeners.get(this);


        if (!detach.has(this))
        {
            attach(this);
        }

        listeners.add(fn);

        return () =>
        {
            listeners.delete(fn);
            if (listeners.size === 0 && detach.has(this))
            {
                detach.get(this)();
            }
        };

    }
}

const
    PUSH = HistoryEvent.PUSH,
    REPLACE = HistoryEvent.REPLACE,
    POP = HistoryEvent.POP,
    HASH = HistoryEvent.HASH;


const
    detach = new Map(),
    EventListeners = new Map([
        [PUSH, new Set()],
        [REPLACE, new Set()],
        [POP, new Set()],
        [HASH, new Set()],
    ]);


function attach(type)
{

    const listener = e =>
    {
        const
            state = (e?.state) ?? history.state,
            url = getUrl(location.href),
            obj = { type, state, url };

        EventListeners.get(this).forEach(fn => fn(obj));
    };



    if (type === POP)
    {

        emitter.on('popstate', listener);

        detach.set(type, () =>
        {
            emitter.off('popstate', listener);
            detach.delete(type);
        });

    } else if (type === HASH)
    {

        emitter.on('hashchange', listener);

        detach.set(type, () =>
        {
            emitter.off('hashchange', listener);
            detach.delete(type);
        });

    } else if (type === PUSH)
    {
        const
            { pushState } = history,
            push = (state, _, url) =>
            {
                pushState.apply(history, [state, _, url]);
                listener({ state });
            };
        detach.set(type, () =>
        {
            if (push === history.pushState)
            {
                history.pushState = pushState;
            }
            detach.delete(type);
        });
    } else
    {
        const
            { replaceState } = history,
            replace = (state, _, url) =>
            {
                replaceState.apply(history, [state, _, url]);
                listener({ state });
            };
        detach.set(type, () =>
        {
            if (replace === history.replaceState)
            {
                history.replaceState = replaceState;
            }
            detach.delete(type);
        });
    }

}
