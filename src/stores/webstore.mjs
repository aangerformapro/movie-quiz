import { uuidv4, encode, decode, isString } from "../utils/utils.mjs";
import { DataStore } from "./datastore.mjs";




const VENDOR_KEY = 'NGSOFT:UUID', SEP = ':';


function getDefaultPrefix()
{
    let prefix;

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



    clear()
    {
        let prefix = this.key(''), { store } = this, keys = [];

        // keys will change inside the loop as they are removed
        for (let i = 0; i < prefix.length; i++)
        {
            keys.push(store.keys(i));
        }

        keys.filter(key => key.startsWith(prefix)).forEach(key => store.removeItem(key));
        super.clear();

    }

    getItem(/** @type {string} */name, defaultValue = null)
    {

        let value = store.getItem(this.key(name));

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
            store.removeItem(this.key(name));
        }
        else
        {
            store.setItem(this.key(name), encode(value));
        }

        return super.setItem(name, value);

    }

}


export const LocalStore = new WebStore(), SessionStore = new WebStore(sessionStorage);

export default LocalStore;
