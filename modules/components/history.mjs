
import { BackedEnum, noop } from '../utils/utils.mjs';
import EventManager from './../utils/event-manager.mjs';
import emitter from './../utils/emitter.mjs';



export class RouterEvent extends BackedEnum
{
    static ALL = new RouterEvent('change');
    static PUSH = new RouterEvent('push pop');
    static REPLACE = new RouterEvent('replace pop');
    static HASH = new RouterEvent('hash');
}


const EventListeners = new EventManager();

let attachedOnce = false;


/**
 * Monkey patch the history pushState
 */
export const attachPushState = (fn = noop) =>
{

    const { pushState } = history;

    function push(state, unused, url)
    {
        pushState.apply(this, [state, unused, url]);
        //notify
        EventListeners.trigger('push change', { url, state }); //async
        fn(url, state); //linear
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
export const attachReplaceState = (fn = noop) =>
{

    const { replaceState } = history;

    function replace(state, unused, url)
    {
        replaceState.apply(this, [state, unused, url]);
        //notify
        EventListeners.trigger('replace change', { url, state });
        fn(url, state);

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




function attachEvents(events = RouterEvent.ALL)
{
    if (!attachedOnce)
    {
        attachedOnce = true;


        if (events === RouterEvent.ALL || events === RouterEvent.PUSH)
        {
            attachPushState();
        }
        if (events === RouterEvent.ALL || events === RouterEvent.REPLACE)
        {
            attachReplaceState();
        }


        if (events.value.includes('pop') || events === RouterEvent.ALL)
        {
            emitter.on('popstate', e =>
            {
                EventListeners.trigger('pop change', {
                    state: e.state,
                    url: location.href
                });
            });
        }

        if (events === RouterEvent.HASH || events === RouterEvent.ALL)
        {
            emitter.on('hashchange', e =>
            {
                EventListeners.trigger('hash change', {
                    state: history.state,
                    url: location.href
                });
            });
        }




    }
}




export default class History
{


    static get eventManager()
    {
        return EventListeners;
    }


    static onChange(fn)
    {

        const type = RouterEvent.ALL.value;

        EventListeners.on(type, fn);

        return () =>
        {
            EventManager.off(type, fn);
        };
    }


    static onPush(fn)
    {

        const type = RouterEvent.PUSH.value;
        EventListeners.on(type, fn);
        return () =>
        {
            EventManager.off(type, fn);
        };

    }

    static onReplace(fn)
    {
        const type = RouterEvent.REPLACE.value;
        EventListeners.on(type, fn);
        return () =>
        {
            EventManager.off(type, fn);
        };
    }



    static onHash(fn)
    {

        const type = RouterEvent.HASH.value;
        EventListeners.on(type, fn);

        return () =>
        {
            EventManager.off(type, fn);
        };
    }


    static start(events = RouterEvent.default)
    {
        attachEvents(events);
    }

}

