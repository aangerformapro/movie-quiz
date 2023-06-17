import EventManager from "../utils/event-manager.mjs";
import { BackedEnum, getClass, isAbstract, isFunction, isPlainObject, isUndef, noop, promisify, } from "../utils/utils.mjs";




/**
 * Private properties
 */
const
    SEP = ':',
    _prefixes = new Map(),
    _hooks = new Map(),
    _prefix = store => _prefixes.get(store),
    _queue = [],
    _events = new Map();




export function updateDataStore(/** @type {DataStore} */  store, /** @type {string} */ name, value)
{
    const hook = store.hook(name);
    if (hook.length > 0)
    {
        _events.get(hook).trigger('update', value);
    }
}


export class DataStoreType extends BackedEnum
{
    static SYNC = new DataStoreType('sync');
    static ASYNC = new DataStoreType('async');
}


export class DataStore
{

    get type()
    {
        return DataStoreType.SYNC;
    }

    constructor(prefix = '')
    {

        if (prefix && !prefix.endsWith(SEP))
        {
            prefix += SEP;
        }

        _prefixes.set(this, prefix);

        _hooks.set(this, new Map());

    }


    // ---------------- Helper Methods ----------------


    static get type()
    {
        return this.prototype.type;
    }

    key(/** @type {string} */name)
    {
        return _prefix(this) + name;
    }

    // ---------------- Subscriptions ----------------



    subscribe(/** @type {string} */name, /** @type {function} */listener, /** @type {function} */ onUpdate = noop)
    {
        return this.hook(name).subscribe(listener, onUpdate);
    }


    // ---------------- Common Methods ----------------


    hasItem(/** @type {string} */name)
    {
        return this.getItem(name) !== null;
    }

    removeItem(name)
    {
        this.setItem(name, null);
    }

    setMany(items = {})
    {
        const result = new Map();
        for (let name in items)
        {
            const value = items[name];
            result.set(name, this.setItem(name, value));
        }

        return result;
    }

    getMany(keys = [], defaultValue = null)
    {
        return keys.map(key => [key, this.getItem(key, defaultValue)]);
    }


    hook(/** @type {string} */name, defaultValue = null)
    {


        if (!_hooks.get(this).has(name))
        {

            const
                listeners = new Set(),
                run_queue = (value) =>
                {

                    promisify(value).then(value =>
                    {
                        const run = !_queue.length;

                        listeners.forEach(item =>
                        {
                            item[1]();
                            _queue.push([item[0], value]);
                        });

                        if (run)
                        {
                            for (let item of _queue)
                            {
                                item[0](item[1]);
                            }
                            _queue.length = 0;

                        }
                    });
                },
                subscribe = (listener, updater = noop) =>
                {
                    if (isFunction(listener))
                    {
                        const obj = [listener, updater];
                        listeners.add(obj);
                        promisify(this.getItem(name, defaultValue)).then(listener);
                        return () =>
                        {
                            listeners.delete(obj);
                        };
                    }

                },
                set = (_value) =>
                {
                    this.setItem(name, _value);
                },
                update = (fn) =>
                {
                    promisify(this.getItem(name)).then(value => set(fn(value)));
                },
                getItem = (defaultValue = null) => this.getItem(name, defaultValue),
                setItem = (value) => this.setItem(name, value);

            const $that = {
                subscribe, set, update, getItem, setItem
            };
            Object.defineProperty($that, 'length', { configurable: true, get: () => listeners.size });
            const evt = new EventManager(false);
            evt.on('update', (e) => run_queue(e.data));
            _events.set($that, evt);
            _hooks.get(this).set(name, $that);
        }
        return _hooks.get(this).get(name);
    }


    clear()
    {

        const keys = this.keys;

        for (let key of keys)
        {
            this.removeItem(key);
        }

        return keys;
    }



    // ---------------- Abstract Methods ----------------


    get keys()
    {
        isAbstract(this, getClass(DataStore), 'clear');
        return [];
    }



    getItem(/** @type {string} */name, defaultValue = null)
    {

        isAbstract(this, getClass(DataStore), 'getItem');

        if (isFunction(defaultValue))
        {

            let result = defaultValue();
            if (result instanceof Promise)
            {
                result.then(value => this.setItem(name, value));
                defaultValue = null;
            }
            else
            {
                defaultValue = this.setItem(name, result);
            }

        }

        return defaultValue;
    }

    setItem(/** @type {string} */name, value)
    {

        isAbstract(this, getClass(DataStore), 'setItem');

        if (isUndef(value))
        {
            throw new TypeError("value is undefined");
        }

        updateDataStore(this, name, value);

        return value;
    }
}


export default DataStore;






export class AsyncDataStore extends DataStore
{



    get type()
    {
        return DataStoreType.ASYNC;
    }



    async setMany(items = {})
    {
        const result = new Map();
        for (let name in items)
        {
            const value = items[name];
            result.set(name, await this.setItem(name, value));
        }

        return result;
    }

    async getMany(keys = [], defaultValue = null)
    {

        const result = [];
        for (let name of keys)
        {
            const value = await this.getItem(name, defaultValue);
            result.push([name, value]);
        }
        return result;
    }


    async hasItem(/** @type {string} */name)
    {
        return await this.getItem(name) !== null;
    }


    async removeItem(name)
    {
        await this.setItem(name, null);
    }


    async clear()
    {

        const keys = this.keys;

        for (let key of await keys)
        {
            await this.removeItem(key);
        }

        return keys;
    }

}









const
    // contains the hooks
    Nested = new Map(),
    //contains the current values
    NestedValues = new Map();


export class NestedStore extends DataStore
{




    get store()
    {
        return NestedValues.get(this);
    }


    get keys()
    {
        return Object.keys(this.hook);
    }


    constructor(/** @type {DataStore} */datastore, /** @type {String} */ key)
    {

        super();

        let current = datastore.getItem(key);
        if (!isPlainObject(current))
        {
            datastore.setItem(key, {});
        }

        const hook = datastore.hook(key);
        Nested.set(this, hook);

        hook.subscribe(value =>
        {
            if (!isPlainObject(value))
            {
                value = {};
            }
            NestedValues.set(this, value);
        });

    }


    getItem(/** @type {string} */name, defaultValue = null)
    {
        return super.getItem(name, NestedValues.store[name] ?? defaultValue);
    }

    setItem(/** @type {string} */name, value)
    {

        if (value === null)
        {
            delete NestedValues.store[name];
        }
        else
        {
            this.store[name] = value;
        }

        // update the hook
        Nested.get(this).setItem(this.store);

        // notify the subscribers
        return super.setItem(name, value);
    }




}



