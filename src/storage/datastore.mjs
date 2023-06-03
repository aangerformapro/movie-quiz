import { isPlainObject, isEmpty } from '../helpers/utils.mjs';


/**
 * The default DataStore interface
 */
export class DataStore
{


    key(name)
    {
        return name;
    }


    has(name)
    {
        return this.get(name, null) !== null;
    }

    multiset(values)
    {

        if (!isPlainObject(values) || isEmpty(values))
        {
            throw new TypeError('values is not a non empty Object');
        }

        for (let name in values)
        {
            let value = values[name];
            this.set(name, value);
        }
    }

    remove(name)
    {
        this.set(name, null);
    }

    set(name, value)
    {
        throw new Error('set() not implemented');
    }

    get(name, defaultValue = null)
    {
        throw new Error('get() not implemented');
    }


    clear()
    {
        throw new Error('clear() not implemented');
    }


}

/**
 * Convert A DatasTore instance into Async
 * This is just a decorator to keep compatibility
 */
export class AsyncDataStore
{


    #datastore;

    constructor(datatore)
    {


        if (datatore instanceof DataStore === false)
        {

            throw new TypeError('Invalid DataStore.');

        }

        this.#datastore = datatore;
    }


    async key(name)
    {
        return this.#datastore.key(name);
    }

    async has(name)
    {
        return this.#datastore.has(name);
    }

    async multiset(values)
    {
        this.#datastore.multiset(values);
        return values;
    }



    async remove(name)
    {
        this.#datastore.remove(name);
        return { name, value: null };
    }

    async set(name, value)
    {

        this.#datastore.set(name, value);
        return { name, value };
    }

    async get(name, defaultValue = null)
    {
        return this.#datastore.get(name, defaultValue);
    }


    async clear()
    {
        this.#datastore.clear();

        return true;
    }


}



export default DataStore;