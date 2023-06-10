import { DataStore } from "./datastore.mjs";


const
    SHARED = 'shared',
    Store = new Map();


export class MemoryStore extends DataStore
{


    get store()
    {
        return Store.get(this.#prefix);
    }

    #prefix;

    constructor(prefix = SHARED)
    {

        super();
        this.#prefix = prefix;

        if (!Store.has(prefix))
        {
            Store.set(prefix, {});
        }

    }



    clear()
    {
        Store.set(this.#prefix, {});
        return super.clear();
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



export default new MemoryStore();


