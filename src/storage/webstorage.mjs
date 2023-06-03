import DataStore from './datastore.mjs';
import { isString, isEmpty, isUndef, JSON, uuidv4, isNull } from '../helpers/utils.mjs';

export class WebStorage extends DataStore
{

    #storage;
    #prefix;

    #generatePrefix()
    {

        let
            key = 'NGSOFT:WebStorage:UUID',
            result = localStorage.getItem(key);

        if (isNull(result))
        {
            localStorage.setItem(key, result = uuidv4());
        }
        return result;
    }

    constructor(webstorage, prefix)
    {
        super();

        webstorage ??= sessionStorage;

        if (![localStorage, sessionStorage].includes(webstorage))
        {
            throw new TypeError('webstorage not an instance of Storage');
        }

        this.#storage = webstorage;
        prefix ??= this.#generatePrefix();

        if (!isEmpty(prefix) && !prefix.endsWith(':'))
        {
            prefix += ':';
        }

        this.#prefix = prefix;
    }


    key(name)
    {
        return this.#prefix + name;
    }


    get(name, defaultValue = null)
    {

        if (!isString(name) || isEmpty(name))
        {
            throw new TypeError('name is not a non empty string');
        }


        let value = this.#storage.getItem(this.key(name));

        if (!isString(value))
        {
            return defaultValue;
        }

        return JSON.parse(value);
    }


    set(name, value)
    {
        if (!isString(name) || isEmpty(name))
        {
            throw new TypeError('name is not a non empty string');
        }

        if (isUndef(value))
        {
            throw new TypeError('value is undefined');
        }


        if (value === null)
        {
            this.#storage.removeItem(this.key(name));
        } else
        {
            this.#storage.setItem(this.key(name), JSON.stringify(value));
        }
    }

    clear()
    {

        let prefix = this.#prefix, store = this.#storage;
        for (let i = 0; i < store.length; i++)
        {
            let name = store.key(i);
            if (name.startsWith(prefix))
            {
                this.#storage.removeItem(name);
            }

        }
    }


}


export const SessionStore = new WebStorage(sessionStorage), LocalStore = new WebStorage(localStorage);

export default WebStorage;



