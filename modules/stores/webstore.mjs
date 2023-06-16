import { uuidv4, encode, decode, isString, IS_UNSAFE } from "../utils/utils.mjs";
import { DataStore, updateDataStore } from "./datastore.mjs";
import emitter from './../utils/emitter.mjs';


const VENDOR_KEY = 'NGSOFT:UUID', SEP = ':';


function getDefaultPrefix()
{

    let prefix = '';


    if (!IS_UNSAFE)
    {
        return prefix;
    }

    if (null === (prefix = localStorage.getItem(VENDOR_KEY)))
    {
        localStorage.setItem(VENDOR_KEY, prefix = uuidv4() + SEP);
    }

    return prefix;
}




export class WebStore extends DataStore
{


    #store;

    get store()
    {
        return this.#store;
    }


    constructor( /** @type {Storage} */   storage, prefix = getDefaultPrefix())
    {

        storage ??= localStorage;
        if (storage instanceof Storage === false)
        {
            throw new TypeError('storage not an instance of Storage');
        }
        super(prefix);
        this.#store = storage;
    }

    get keys()
    {

        const result = [], prefix = this.key(''), { store } = this;

        for (let i = 0; i < store.length; i++)
        {

            let key = store.key(i);
            if (key.startsWith(prefix))
            {
                result.push(key.slice(prefix.length));
            }

        }

        return result;
    }



    getItem(/** @type {string} */name, defaultValue = null)
    {

        let value = this.store.getItem(this.key(name));

        if (!isString(value))
        {
            return super.getItem(name, defaultValue);
        }

        return super.getItem(name, decode(value));
    }

    setItem(/** @type {string} */name, value)
    {

        if (value === null)
        {
            this.store.removeItem(this.key(name));
        }
        else
        {
            this.store.setItem(this.key(name), encode(value));
        }

        return super.setItem(name, value);

    }



    hook(/** @type {string} */name, defaultValue = null)
    {

        const hook = super.hook(name, defaultValue);

        if (!hook._custom)
        {
            const
                { subscribe } = hook,
                listener = e =>
                {
                    if (e.storageArea === this.store)
                    {
                        if (e.key === this.key(name))
                        {
                            updateDataStore(this, name, decode(e.newValue));
                        }
                    }
                };

            hook._custom = true;

            let attached = false;


            hook.subscribe = (...args) =>
            {


                if (!attached)
                {
                    // listen to other tabs modifications
                    emitter.on('storage', listener);
                    attached = true;
                }


                const unsub = subscribe.apply(this, args);
                return () =>
                {
                    unsub();
                    emitter.off('storage', listener);
                    attached = false;
                };

            };
        }
        return hook;
    }

}


export const LocalStore = new WebStore(), SessionStore = new WebStore(sessionStorage);

export default LocalStore;
