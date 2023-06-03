import { isFunction, isString, isUnsignedInt, runAsync, JSON } from "../helpers/utils.mjs";
import DataStore from "./datastore.mjs";

/**
 * Listen to DataStore for value changes
 */
export class ValueChangeListener
{

    #datastore;
    #name;
    #ticks;
    #interval = null;
    #listeners;


    get name()
    {
        return this.#name;
    }

    get datastore()
    {
        return this.#datastore;
    }

    get ticks()
    {
        return this.#ticks;
    }

    get running()
    {
        return this.#interval !== null;
    }

    get listeners()
    {
        return this.#listeners;
    }

    get length()
    {
        return this.listeners.length;
    }

    constructor(datastore, name, ticks = 900)
    {

        if (datatore instanceof DataStore === false)
        {
            throw new TypeError('Invalid DataStore.');

        }
        this.#datastore = datastore;

        if (!isString(name) || isEmpty(name))
        {
            throw new TypeError('name is not a non empty string');
        }
        this.#name = name;

        if (!isUnsignedInt(ticks))
        {
            throw new TypeError('ticks must be an unsigned integer');
        }

        this.#ticks = ticks;
        this.#listeners = [];
    }


    startListening()
    {

        if (!this.running)
        {

            let prev = this.#datastore.get(this.#name);

            this.#interval = setInterval(() =>
            {

                let current = this.#datastore.get(this.#name);

                // if we use store in objects we must compare json string
                if (JSON.stringify(current) !== JSON.stringify(prev))
                {
                    for (let listener of this.#listeners)
                    {
                        runAsync(listener, current, prev, this.#name);
                    }

                    prev = current;
                }

            }, this.#ticks);
        }

    }


    stopListening()
    {

        if (this.running)
        {
            clearInterval(this.#interval);
            this.#interval = null;
        }

    }


    addListener(listener)
    {

        if (!isFunction(listener))
        {
            throw new TypeError('listener must be a Function');
        }

        this.listeners.push(listener);

        if (!this.running)
        {
            this.startListening();
        }

    }

    deleteListener(listener)
    {
        if (!isFunction(listener))
        {
            throw new TypeError('Listener is not a Function.');
        }
        this.#listeners = this.#listeners.filter(l => l !== listener);
        if (!this.length)
        {
            this.stopListening();
        }

    }


    clear()
    {
        this.#listeners = [];
        this.stopListening();
    }



}


export default ValueChangeListener;