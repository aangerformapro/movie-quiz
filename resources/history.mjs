
import { BackedEnum, getUrl, isFunction, noop } from '../utils/utils.mjs';
import EventManager from './../utils/event-manager.mjs';
import emitter from './../utils/emitter.mjs';



export class HistoryEvent extends BackedEnum
{
    static ALL = new HistoryEvent('change');
    static PUSH = new HistoryEvent('push pop');
    static REPLACE = new HistoryEvent('replace pop');
    static HASH = new HistoryEvent('hash');


    get list()
    {
        return this.value.split(' ');
    }

    get first()
    {
        return this.list[0];
    }
}


const EventListeners = new EventManager();

let attachedOnce = false;


/**
 * Monkey patch the history pushState
 */
export const attachPushState = (/** @type {function} */ fn) =>
{


    if (!isFunction(fn))
    {
        throw new TypeError("fn is not a Function");
    }


    const { pushState } = history;

    function push(state, unused, url)
    {
        pushState.apply(history, [state, unused, url]);
        fn(getUrl(url), state); //linear
    }

    history.pushState = push;

    return () =>
    {
        if (push === history.pushState)
        {
            history.pushState = pushState;
        }
    };

};

/**
 * Monkey patch the history replaceState
 */
export const attachReplaceState = (/** @type {function} */ fn) =>
{

    if (!isFunction(fn))
    {
        throw new TypeError("fn is not a Function");
    }



    const { replaceState } = history;

    function replace(state, unused, url)
    {
        replaceState.apply(history, [state, unused, url]);
        fn(getUrl(url), state);
    }

    history.replaceState = replace;

    return () =>
    {
        if (replace === history.replaceState)
        {
            history.replaceState = replaceState;
        }
    };

};


const unsetEvents = new Set();

function attachEvents(events = HistoryEvent.ALL)
{
    if (!attachedOnce)
    {
        attachedOnce = true;


        if (events === HistoryEvent.ALL || events === HistoryEvent.PUSH)
        {
            unsetEvents.add(
                attachPushState((url, state) =>
                {
                    EventListeners.trigger(HistoryEvent.PUSH.first + ' change', { url, state });
                })
            );
        }
        if (events === HistoryEvent.ALL || events === HistoryEvent.REPLACE)
        {
            unsetEvents.add(
                attachReplaceState((url, state) =>
                {
                    EventListeners.trigger(HistoryEvent.REPLACE.first + ' change', { url, state });
                })
            );
        }


        if (events.value.includes('pop') || events === HistoryEvent.ALL)
        {

            const listener = e =>
            {
                EventListeners.trigger('pop change', {
                    state: e.state,
                    url: getUrl(location.href)
                });
            };

            emitter.on('popstate', listener);

            unsetEvents.add(() => emitter.off('popstate', listener));
        }

        if (events === HistoryEvent.HASH || events === HistoryEvent.ALL)
        {

            const listener = e =>
            {
                EventListeners.trigger('hash change', {
                    state: history.state,
                    url: getUrl(location.href)
                });
            };

            emitter.on('hashchange', listener);

            unsetEvents.add(() => emitter.off('hashchange', listener));
        }

    }

    return () =>
    {

        unsetEvents.forEach(fn => fn());
        unsetEvents.clear();
    };
}




export default class History
{


    static get eventManager()
    {
        return EventListeners;
    }


    static onChange(fn)
    {

        const type = HistoryEvent.ALL.value;

        EventListeners.on(type, fn);

        return () =>
        {
            EventListeners.off(type, fn);
        };
    }


    static onPush(fn)
    {

        const type = HistoryEvent.PUSH.value;
        EventListeners.on(type, fn);
        return () =>
        {
            EventListeners.off(type, fn);
        };

    }

    static onReplace(fn)
    {
        const type = HistoryEvent.REPLACE.value;
        EventListeners.on(type, fn);
        return () =>
        {
            EventListeners.off(type, fn);
        };
    }



    static onHash(fn)
    {

        const type = HistoryEvent.HASH.value;
        EventListeners.on(type, fn);

        return () =>
        {
            EventListeners.off(type, fn);
        };
    }


    static start(events = HistoryEvent.default)
    {
        return attachEvents(events);
    }

}

