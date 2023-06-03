import DataStore from './datastore.mjs';
import { isString, isEmpty, isUndef, JSON } from '../helpers/utils.mjs';

const GlobalStorage = {};

export class MemoryStorage extends DataStore
{

    get #storage()
    {
        return GlobalStorage[this.#id];
    }

    #id;

    constructor(id = 'shared')
    {
        super();

        if (!isString(id) || isEmpty(id))
        {
            throw new TypeError('id is not a non empty string');
        }

        this.#id = id;
        GlobalStorage[id] ??= {};
    }


    get(name, defaultValue = null)
    {

        if (!isString(name) || isEmpty(name))
        {
            throw new TypeError('name is not a non empty string');
        }


        let value = this.#storage[name];

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
            delete this.#storage[name];

        } else
        {
            this.#storage[name] = JSON.stringify(value);
        }

    }

    clear()
    {

        let keys = Object.keys(this.#storage);

        for (let i = 0; i < keys.length; i++)
        {
            this.remove(keys[i]);
        }

    }

}

export const SharedStorage = new MemoryStorage();

export default MemoryStorage;
