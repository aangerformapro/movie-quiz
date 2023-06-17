
import pantry from "pantry-node";
import { AsyncDataStore } from "./datastore.mjs";
import { isUndef } from "../utils/utils.mjs";




const
    connections = new Map(),
    // keys
    keys = new Map(),

    PANTRY_BASKET_NAME = "basket",
    PANTRY_API_KEY = "96b40065-e031-4f18-87e5-16543584e8eb";
// PANTRY_API_KEY = "96b40065-e031-4f18-87e5-16543584e8ed";


const addKeys = (store, ...keys) =>
{


    if (!keys.has(store))
    {
        keys.set(store, []);
    }

    const basket = keys.get(store);

    for (let key of keys)
    {
        if (!basket.includes(key))
        {
            basket.push(key);
        }

    }

    return basket;
};




export default class PantryStore extends AsyncDataStore
{

    get store()
    {
        return connections.get(this);
    }


    constructor(/** @type {string} */api_key = PANTRY_API_KEY)
    {
        super();
        connections.set(this, new pantry(api_key));
    }


    get keys()
    {
        // we need to wait for connection to resolve
        return new Promise(resolve =>
        {
            if (keys.has(this))
            {
                return resolve(keys.get(this));
            }

            this.store.details()
                .then(
                    data => resolve(
                        addKeys(this, ...data.baskets.map(item => item.name))
                    )
                )
                .catch(err =>
                {
                    throw new Error("Cannot connect to pantry.cloud, Wrong api key");
                });
        });
    }




    async getItem(/** @type {string} */name, defaultValue = null)
    {

        try
        {
            const data = await this.store.basket.get(name).then(item => item.value);
            return super.getItem(name, data);

        } catch (err)
        {
            return super.getItem(name, defaultValue);
        }
    }


    async setItem(/** @type {string} */name, value)
    {

        if (!isUndef(value))
        {

            if (value === null)
            {
                try
                {
                    await this.store.basket.delete(name);
                } catch (err)
                {
                    // value does not exists, so we do nothing
                }

            }
            else
            {
                try
                {
                    await this.store.basket.create(name, { value });
                } catch (error)
                {
                    throw new Error("Cannot set basket value for " + name);
                }

            }
        }

        return super.setItem(name, value);
    }

}

const baskets = new Map(), data = new Map();


// caches the pantry basket into memory
async function getData(store, name)
{

    if (!data.has(store))
    {
        let obj;

        try
        {

            //check if basket exists
            const conn = connections.get(store), basket = baskets.get(store);

            if (
                await conn.details()
                    .then(item => item.baskets)
                    .then(items =>
                        items.some(
                            item => item.name === basket
                        ))
            )
            {
                obj = await conn.basket.get(basket);
            }
            else
            {
                obj = {};
            }

        } catch (error)
        {
            obj = {};
        }

        data.set(store, obj);
    }

    if (!name)
    {
        return data.get(store);
    }

    return data.get(store)[name];

}

export class PantryBasket extends AsyncDataStore
{


    get store()
    {
        return connections.get(this);
    }

    constructor(/** @type {string} */api_key = PANTRY_API_KEY, /** @type {string} */ basket = PANTRY_BASKET_NAME)
    {
        super();
        connections.set(this, new pantry(api_key));
        baskets.set(this, basket);
    }


    get keys()
    {
        // we need to wait for connection to resolve
        return new Promise(resolve =>
        {
            if (keys.has(this))
            {
                return resolve(keys.get(this));
            }

            this.store.details()
                .then(
                    data => resolve(
                        addKeys(this, ...data.baskets.map(item => item.name))
                    )
                )
                .catch(err =>
                {
                    throw new Error("Cannot connect to pantry.cloud.");
                });
        });
    }




    async getItem(/** @type {string} */name, defaultValue = null)
    {
        return super.getItem(name, await getData(this, name) ?? defaultValue);
    }


    async setItem(/** @type {string} */name, value)
    {

        if (!isUndef(value))
        {
            try
            {
                const current = await getData(this);
                current[name] = value;
                await this.store.basket.create(baskets.get(this), current);

            } catch (error)
            {
                throw new Error("Cannot set basket value for " + name);
            }

        }

        return super.setItem(name, value);
    }

}

