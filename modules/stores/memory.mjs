import { isEmpty, isPlainObject, isUndef } from "../utils/utils.mjs";
import { DataStore } from "./datastore.mjs";


const
    SHARED = 'shared',
    Store = new Map(),
    Hooks = new Map();


export class MemoryStore extends DataStore
{


    get store()
    {
        return Store.get(this.key(''));
    }



    constructor(prefix = SHARED)
    {

        if (isEmpty(prefix))
        {
            throw new TypeError("prefix cannot be empty");
        }

        super(prefix);


        if (!Store.has(prefix))
        {
            Store.set(prefix, {});
        }

    }


    get keys()
    {
        return Object.keys(this.store);
    }




    getItem(/** @type {string} */name, defaultValue = null)
    {
        return super.getItem(name, this.store[name] ?? defaultValue);
    }

    setItem(/** @type {string} */name, value)
    {

        if (value === null)
        {
            delete this.store[name];
        }
        else
        {
            this.store[name] = value;
        }

        return super.setItem(name, value);

    }

}





/**
 * Takes a key in an obj and manages it
 */
export class NestedStore extends DataStore
{


    get hook()
    {
        return Hooks.get(this);
    }


    constructor(store, name)
    {
        super();

        const hook = store.hook(name);


        Hooks.set(this, hook);

        if (!isPlainObject(hook.getItem()))
        {
            hook.setItem({});
        }
    }


    get keys()
    {
        return Object.keys(this.hook.getItem({}));
    }



    getItem(/** @type {string} */name, defaultValue = null)
    {
        return super.getItem(name, this.hook.getItem(name) ?? defaultValue);
    }

    setItem(/** @type {string} */name, value)
    {

        if (value === null)
        {
            this.hook.setItem(this.key(name), null);
        }
        else
        {
            this.hook.setItem(this.key(name), encode(value));
        }

        return super.setItem(name, value);
    }
}


export default new MemoryStore();


