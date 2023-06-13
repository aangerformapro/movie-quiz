
import { noop } from '../utils/utils.mjs';
import EventManager from './../utils/event-manager.mjs';
import emitter from './../utils/emitter.mjs';




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
        pushState.apply(context, [arguments]); (this, [state, unused, url]);
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
        replaceState.apply(context, [arguments]); (this, [state, unused, url]);
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




function attachEvents()
{
    if (!attachedOnce)
    {
        attachedOnce = true;
        attachPushState();
        attachReplaceState();
        emitter.on('popstate hashchange', e =>
        {
            const type = e.type === 'popstate' ? 'pop' : 'hash';
            EventListeners.trigger(type + ' change', {
                state: e.state ?? history.state,
                url: location.href
            });
        });


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

        attachEvents();
        EventListeners.on('change', fn);

        return () =>
        {
            EventManager.off('change', fn);
        };
    }


    static onPush(fn)
    {

        attachEvents();
        EventListeners.on('push', fn);


        return () =>
        {
            EventManager.off('push', fn);
        };

    }
    static onReplace(fn)
    {

        attachEvents();
        EventListeners.on('replace', fn);

        return () =>
        {
            EventManager.off('replace', fn);
        };

    }

    static onPop(fn)
    {

        attachEvents();
        EventListeners.on('pop', fn);


        return () =>
        {
            EventManager.off('pop', fn);
        };

    }

    static onHash(fn)
    {
        attachEvents();
        EventListeners.on('hash', fn);

        return () =>
        {
            EventManager.off('hash', fn);
        };
    }

}