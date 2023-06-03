/* global unsafeWindow, globalThis */


const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (typeof globalThis !== 'undefined' ? globalThis : window);
const { document: document$1, JSON } = global;
const RE_NUMERIC = /^-?(?:[\d]+\.)?\d+$/;

const isPlainObject = (param) => param instanceof Object && Object.getPrototypeOf(param) === Object.prototype,
    isUndef = (param) => typeof param === 'undefined',
    isString = (param) => typeof param === 'string',
    isNumber = (param) => typeof param === 'number',
    isInt = (param) => Number.isInteger(param),
    isFloat = (param) => isNumber(param) && parseFloat(param) === param,
    isUnsignedInt = (param) => param >= 0 && isInt(param),
    isNumeric = (param) => isInt(param) || isFloat(param) || RE_NUMERIC.test(param),
    isBool = (param) => typeof param === 'boolean',
    isArray = (param) => Array.isArray(param),
    isNull = (param) => param === null,
    isCallable = (param) => typeof param === 'function',
    isFunction = isCallable,
    capitalize = (param) => isString(param) && param.split(/\s+/).map(param => param.charAt(0).toUpperCase() + param.slice(1).toLowerCase()).join(' ');

function runAsync(callback, ...args)
{
    if (isFunction(callback))
    {
        setTimeout(() =>
        {
            callback(...args);
        }, 0);
    }
}
function isValidSelector(selector)
{

    try
    {
        return isString(selector) && null === document$1.createElement('template').querySelector(selector);

    } catch (e)
    {
        return false;
    }

}

function toCamel(name = '')
{

    if (!isString(name))
    {
        throw new TypeError('name must be a String');
    }

    let index;
    while (-1 < (index = name.indexOf("-")))
    {
        name = name.slice(0, index) + capitalize(name.slice(index + 1));
    }
    return name;
}

function isHTML(param)
{
    return isString(param) && param.startsWith('<') && param.endsWith('>');
}


function decode(value)
{

    if (isUndef(value) || isNull(value) || value === '')
    {
        return null;
    }
    if (
        (value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']')) ||
        isNumeric(value) || value === 'true' || value === 'false'
    )
    {
        return JSON.parse(value);
    }

    return value;
}


function encode(value)
{

    if (!isString(value))
    {
        return JSON.stringify(value);
    }
    return value;
}






function parseDataElement(data, root = true)
{

    let result = [];

    data ??= {};

    for (let key in data)
    {

        let value = data[key];

        if (isPlainObject(value))
        {
            result = result.concat(parseDataElement(value, false).map(
                item => [key + '-' + item[0], item[1]]
            ));
            continue;
        }
        result.push([key, encode(value)]);
    }
    return result.map(item => root ? ['data-' + item[0], item[1]] : item);
}



/**
 * Creates an Element
 *
 * @param {string} tagName
 * @param {Object} [params]
 * @param {string|HTMLElement|string[]|HTMLElement[]} [html]
 * @returns {HTMLElement}
 */
function createElement(tag, params = null, html = '')
{

    if (typeof tag !== 'string')
    {
        throw new TypeError('tag must be a String');
    }

    if (
        typeof params === 'string' ||
        params instanceof Element ||
        isArray(params)
    )
    {
        html = params;
        params = {};
    }

    params ??= {};
    html ??= '';


    const elem = isHTML(tag) ? html2element(tag) : document$1.createElement(tag);

    for (let attr in params)
    {
        let value = params[attr];
        if (attr === 'html')
        {
            html = value;
            continue;
        }
        if (attr === 'data')
        {
            if (isPlainObject(value))
            {
                parseDataElement(value).forEach(item =>
                {
                    const [key, val] = item;
                    elem.setAttribute(key, val);
                });
            }
            continue;
        }

        if (typeof value === 'string')
        {
            elem.setAttribute(attr, value);
        }
        else
        {
            elem[attr] = value;
        }
    }

    if (html instanceof Element || isString(html))
    {
        html = [html];
    }

    if (Array.isArray(html))
    {

        html.forEach(item =>
        {
            if (item instanceof Element)
            {
                elem.appendChild(item);
            } else if (typeof item === 'string')
            {
                elem.innerHTML += item;
            }
        });
    }
    return elem;
}




/**
 * Creates an HTMLElement from html code
 * @param {string} html
 * @returns {HTMLElement|Array|undefined}
 */
function html2element(html)
{
    if (isString(html) && html.length > 0)
    {
        let template = createElement('template', html),
            content = template.content;
        if (content.childNodes.length === 0)
        {
            return;
        }
        else if (content.childNodes.length > 1)
        {
            return [...content.childNodes];
        }
        return content.childNodes[0];
    }
}

/**
 * A small Event manager that does not uses DOM
 */





class EventManager {

    #listeners
    #useasync

    static #events

    constructor(useasync = true) {
        this.#listeners = [];
        this.#useasync = useasync;
    }


    getListenersForEvent(type) {

        if (!isString(type) || type.includes(' ')) {
            throw new TypeError('Invalid event type, not a String or contains spaces.');
        }

        return this.#listeners.filter(item => item.type === type).map(item => item.listener);
    }


    on(type, listener, once = false) {

        if (!isString(type)) {
            throw new TypeError('Invalid event type, not a String.');
        }

        if (!isFunction(listener)) {
            throw new TypeError('Invalid listener, not a function');
        }



        type.split(/\s+/).forEach(type => {
            this.#listeners.push({
                type, listener, once: once === true
            });
        });

        return this;
    }


    one(type, listener) {
        return this.on(type, listener, true);
    }


    off(type, listener) {

        if (!isString(type)) {
            throw new TypeError('Invalid event type, not a String.');
        }

        type.split(/\s+/).forEach(type => {

            this.#listeners = this.#listeners.filter(item => {
                if (type === item.type) {
                    if (listener === item.listener || !listener) {
                        return false;
                    }
                }
                return true;
            });
        });


        return this;
    }


    trigger(type, data = null) {

        let event;

        if (type instanceof Event) {
            event = type;
            event.data ??= data;
            type = event.type;
        }

        if (!isString(type) && type instanceof Event === false) {
            throw new TypeError('Invalid event type, not a String|Event.');
        }


        const listeners = Array.from(this.#listeners), types = [];

        type.split(/\s+/).forEach(type => {

            if (types.includes(type)) {
                return;
            }

            types.push(type);

            for (let item of listeners) {

                if (item.type === type) {

                    if (this.#useasync) {
                        runAsync(item.listener, event ?? { type, data });

                    } else {
                        item.listener(event ?? { type, data });
                    }

                    if (item.once) {
                        this.off(type, item.listener);
                    }
                }
            }


        });

        return this;


    }


    mixin(binding) {

        if (binding instanceof Object) {
            ['on', 'off', 'one', 'trigger'].forEach(method => {
                Object.defineProperty(binding, method, {
                    enumerable: false, configurable: true,
                    value: (...args) => {
                        this[method](...args);
                        return binding;
                    }
                });
            });

        }

        return this;
    }


    static mixin(binding, useasync = true) {
        return (new EventManager(useasync)).mixin(binding);
    }


    static on(type, listener, once = false) {
        this.#events ??= new EventManager();
        return this.#events.on(type, listener, once);
    }

    static one(type, listener) {
        this.#events ??= new EventManager();
        return this.#events.one(type, listener);
    }

    static off(type, listener) {
        this.#events ??= new EventManager();
        return this.#events.off(type, listener);
    }

    static trigger(type, data = null) {
        this.#events ??= new EventManager();
        return this.#events.trigger(type, data);
    }

}

class Progress
{


    get started()
    {
        return this.#started;
    }


    get percentage()
    {
        return Math.ceil((this.current / this.total) * 100);
    }


    get complete()
    {
        return this.#completed || this.current >= this.total;
    }


    get completed()
    {
        return this.#completed;
    }

    get total()
    {
        return this.#total;
    }

    get current()
    {
        return this.#current;
    }


    set total(value)
    {
        if (!isUnsignedInt(total) || total === 0)
        {
            throw new TypeError("total must be an > 0");
        }

        this.#total = Math.max(1, value);
        this.reeset();
    }

    set current(value)
    {

        let prev = this.#current;

        if (value !== prev && !this.#completed)
        {

            if (!this.#started)
            {
                this.#started = true;
                this.trigger('start', this.#getEventData());
            }

            this.#current = Math.max(0, Math.min(value, this.total));
            this.#update();

            if (value > prev)
            {
                this.trigger('increment', { value: this.#current - prev, ...this.#getEventData() });
            }
            else
            {
                this.trigger('decrement', { value: this.#current - prev, ...this.#getEventData() });
            }

            if (!this.completed && this.complete)
            {
                this.#completed = true;
                this.trigger('complete', this.#getEventData());
            }

        }

    }

    increment(value = 1)
    {
        if (!isInt(value))
        {
            throw new TypeError("value must be an integer");
        }

        this.current += value;
    }


    decrement(value = 1)
    {

        if (!isInt(value))
        {
            throw new TypeError("value must be an integer");
        }

        this.increment(-1 * value);
    }


    #total = 100;
    #current = 0;
    #started = false;
    #completed = false;

    constructor(total = 100)
    {
        if (!isUnsignedInt(total))
        {
            throw new TypeError("total must be an integer > 0");
        }

        EventManager.mixin(this);
        this.#total = total;
        this.reset();
    }


    reset()
    {
        this.#current = 0;
        this.#started = this.#completed = false;

        this.trigger('reset', this.#getEventData());
    }



    #update()
    {
        this.trigger('change', this.#getEventData());
    }


    #getEventData()
    {

        let { current, total, percentage, complete } = this;

        return {
            loader: this,
            current,
            total,
            percentage,
            complete,
        };
    }

}

let api = {

    set(elem, attr, value)
    {
        if (nullUndef.includes(value))
        {
            this.remove(elem, attr);
        }

        getAttrs(attr).forEach(x =>
        {
            elem.dataset[x] = encode(value);
        });
    },
    get(elem, attr, fallback = null)
    {
        let result = getAttrs(attr).map(x => decode(elem.dataset[x])).map(x => !nullUndef.includes(x) ? x : fallback);

        if (result.length <= 1)
        {
            return result[0] ?? fallback;
        }

        return result;
    },
    remove(elem, attr)
    {
        getAttrs(attr).forEach(x => delete elem.dataset[x]);
    }


}, undef, nullUndef = [null, undef];



function getAttrs(attr)
{
    let result = [];

    if (isString(attr))
    {
        if (attr.startsWith('data-'))
        {
            attr = attr.slice(5);
        }
        result = [toCamel(attr)];
    }


    if (isArray(attr))
    {
        result = result.concat(...attr.map(x => getAttrs(x)));
    }

    return result;
}




function getElem(elem)
{
    if (hasDataset(elem))
    {
        return [elem];
    }

    if (elem instanceof NodeList)
    {
        return [...elem];
    }

    if (isArray(elem))
    {
        return elem.filter(x => hasDataset(x));
    }

    return isValidSelector(elem) ? [...document.querySelectorAll(elem)] : [];
}

function hasDataset(elem)
{
    return elem instanceof Object && elem.dataset instanceof DOMStringMap;
}





/**
 * data-attribute reader/setter
 * @param {Node|NodeList|String} elem 
 * @param {String} attr 
 * @param {Any} [value]
 */
function dataset(elem, attr, value)
{

    elem = getElem(elem);


    function get(attr, fallback = null)
    {

        let x = elem[0];
        if (hasDataset(x))
        {
            return api.get(x, attr, fallback);
        }

        return fallback;
    }


    function set(attr, value)
    {
        if (isPlainObject(attr))
        {

            for (let key in attr)
            {
                set(key, attr[key]);
            }
        }
        else
        {
            elem.forEach(x => api.set(x, attr, value));
        }

        return $this;

    }


    function remove(attr)
    {
        elem.forEach(x => api.remove(x, attr));
        return $this;
    }


    const $this = { get, set, remove };

    switch (arguments.length)
    {
        case 2:
            return get(attr);

        case 3:
            return set(attr, value);

    }

    return $this;

}

let cache;

/**
 * @link https://stackoverflow.com/questions/5573096/detecting-webp-support
 */
function checkWebpSupport()
{
    return new Promise(res =>
    {

        if (isBool(cache))
        {
            return resolve(cache);
        }

        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () =>
        {
            res(cache = webP.height === 2);
        };

    });
}

await checkWebpSupport().then(x =>
{
    dataset(document.documentElement, 'webp', x);
    return x;
});

const
    { body } = document,
    progress = createElement('<div class="progress w-512px mx-auto mt-5rem" data-complete="Yay!!!" ><div class="progress-bar"></div></div>'),
    line = createElement('div', {
        class: 'progress-line grow',
    }),
    g = document.querySelector('.loader-g'),
    loader = new Progress();


loader
    .one('start', e =>
    {
        document.body.appendChild(progress);

        document.body.appendChild(line);
    })
    .on('change', e =>
    {
        let { percentage } = e.data;

        // progress.dataset.percent = percentage;

        body.style = `--progress: ${percentage}`;

        g.dataset.percent =
            progress.firstElementChild.innerHTML =
            percentage;


        //progress.textContent = progress.style.width = percentage + '%';

    })
    .on('complete', e =>
    {
        //progress.textContent = 'Chargement fini.';
        clearInterval(inter);
        progress.classList.add("complete");



    });





let inter = setInterval(() =>
{
    //console.debug(loader, loader.current);
    loader.current += Math.floor(Math.random() * 7);








}, 100);
//# sourceMappingURL=moviequizz.js.map
