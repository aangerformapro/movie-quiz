import { BackedEnum, getClass, isAbstract, isFunction, isUndef, noop, } from "../helpers/utils.mjs";





const
    SEP = ':',
    _prefixes = new Map(),
    _hooks = new Map(),
    _prefix = store => _prefixes.get(store),
    _queue = [],
    _notify = (store, name, value) =>
    {
        const hook = store.hook(name);
        if (hook.length > 0)
        {
            hook(value);
        }
    };


export class DataStoreType extends BackedEnum
{
    static SYNC = new DataStoreType('sync');
    static ASYNC = new DataStoreType('async');
}





function getHook( /** @type {DataStore} */  store, /** @type {string} */  name)
{


    if (!_hooks.has(store))
    {
        _hooks.set(store, new Map());
    }

    const map = _hooks.get(store);

    if (!map.has(name))
    {

        const
            listeners = new Set(),
            hook = (value) =>
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
            };

        Object.assign(hook, {

            subscribe(listener, updater = noop)
            {
                if (isFunction(listener))
                {
                    const obj = [listener, updater];

                    listeners.add(obj);
                    listener(this.getItem());
                    return () =>
                    {
                        listeners.delete(obj);
                    };

                }

            },
            getItem: (defaultValue = null) => store.getItem(name, defaultValue),
            setItem: (value) => store.setItem(name, value),
            hasItem: () => store.hasItem(name),
            removeItem: () => store.removeItem(name),
        });

        Object.defineProperty(hook, 'length', {
            configurable: true,
            get()
            {
                return listeners.size;
            }

        });

        map.set(name, hook);
    }


    return map.get(name);
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


    hook(/** @type {string} */name)
    {
        return getHook(this, name);
    }



    // ---------------- Abstract Methods ----------------


    clear()
    {
        [
            getClass(DataStore),
            getClass(AsyncDataStore)
        ].forEach(x => isAbstract(this, x, 'clear'));
        _notify(this);
    }

    getItem(/** @type {string} */name, defaultValue = null)
    {
        [
            getClass(AsyncDataStore),
            getClass(DataStore)
        ].forEach(x => isAbstract(this, x, 'getItem'));

        if (isFunction(defaultValue))
        {
            defaultValue = this.setItem(name, defaultValue());
        }

        return defaultValue;
    }

    setItem(/** @type {string} */name, value)
    {

        [
            getClass(AsyncDataStore),
            getClass(DataStore)
        ].forEach(x => isAbstract(this, x, 'setItem'));

        if (isUndef(value))
        {
            throw new TypeError("value is undefined");
        }

        _notify(this, name, value);

        return value;
    }
}

export class AsyncDataStore extends DataStore
{


    get type()
    {
        return DataStoreType.ASYNC;
    }

    // ---------------- Common Methods ----------------

    async hasItem(/** @type {string} */name)
    {
        return super.hasItem(name);
    }

    async removeItem(name)
    {
        return super.removeItem(name);
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
        return await Promise.all(keys.map(key => [key, this.getItem(key, defaultValue)]));
    }




}

