/* global unsafeWindow, globalThis */


const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (typeof globalThis !== 'undefined' ? globalThis : window);
const { document, JSON } = global;
const RE_NUMERIC = /^-?(?:[\d]+\.)?\d+$/;

export const
    isPlainObject = (param) => param instanceof Object && Object.getPrototypeOf(param) === Object.prototype,
    isUndef = (param) => typeof param === 'undefined',
    isString = (param) => typeof param === 'string',
    isNumber = (param) => typeof param === 'number',
    isInt = (param) => Number.isInteger(param),
    isFloat = (param) => isNumber(param) && parseFloat(param) === param,
    isUnsigned = (param) => param >= 0 && isNumber(param),
    isUnsignedInt = (param) => param >= 0 && isInt(param),
    isNumeric = (param) => isInt(param) || isFloat(param) || RE_NUMERIC.test(param),
    intVal = (param) => isNumeric(param) && parseInt(param),
    floatVal = (param) => isNumeric(param) && parseFloat(param),
    isBool = (param) => typeof param === 'boolean',
    isArray = (param) => Array.isArray(param),
    isNull = (param) => param === null,
    isObject = (param) => typeof param === 'object' && !isNull(param),
    isCallable = (param) => typeof param === 'function',
    isFunction = isCallable,
    isScalar = (param) => isNumeric(param) || isString(param) || isBool(param),
    capitalize = (param) => isString(param) && param.split(/\s+/).map(param => param.charAt(0).toUpperCase() + param.slice(1).toLowerCase()).join(' ');

const
    VALID_REFERERRPOLICY = [
        'no-referrer', 'no-referrer-when-downgrade',
        'origin', 'origin-when-cross-origin',
        'same-origin', 'strict-origin',
        'strict-origin-when-cross-origin', 'unsafe-url'
    ],
    VALID_CROSSORIGIN = ['', 'use-credentials', 'anonymous'];
export function isEmpty(param)
{

    if (isUndef(param) || param === null)
    {
        return true;
    }
    if (isString(param) || isArray(param))
    {
        return param.length === 0;
    }
    if (isNumber(param))
    {
        return param === 0;
    }

    if (isPlainObject(param))
    {
        return Object.keys(param).length === 0;
    }
    return false;
}

export function runAsync(callback, ...args)
{
    if (isFunction(callback))
    {
        setTimeout(() =>
        {
            callback(...args);
        }, 0);
    }
}
export function isValidSelector(selector)
{

    try
    {
        return isString(selector) && null === document.createElement('template').querySelector(selector);

    } catch (e)
    {
        return false;
    }

}


export function uuidv4()
{
    let uuid = "", i, random;
    for (i = 0; i < 32; i++)
    {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20)
        {
            uuid += "-";
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}


export function isElement(elem)
{
    return elem instanceof Object && isFunction(elem.querySelector);
}

export function toCamel(name = '')
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


export function toDashed(name = '')
{
    if (!isString(name))
    {
        throw new TypeError('name must be a String');
    }
    return name.replace(/([A-Z])/g, function (u)
    {
        return "-" + u.toLowerCase();
    });
}

export function isHTML(param)
{
    return isString(param) && param.startsWith('<') && param.endsWith('>');
}


export function decode(value)
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


export function encode(value)
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
export function createElement(tag, params = null, html = '')
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


    const elem = isHTML(tag) ? html2element(tag) : document.createElement(tag);

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
 * Generate a unique ID
 * @returns {String}
 */
export function uniqid()
{

    let value;
    uniqid.values ??= [];

    while (!value || uniqid.values.includes(value))
    {
        value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    uniqid.values.push(value);
    return value;
}

/**
 * Clones an Object
 * @param {Object} obj
 * @returns {Object|undefined}
 */
export function clone(obj)
{
    if (obj instanceof Object)
    {
        return Object.assign({}, obj);
    }

    return obj;
}

/**
 * Clones Object recursively
 * 
 * @param {Object} obj 
 * @returns 
 */
export function cloneRecursive(obj)
{
    if (obj instanceof Object)
    {

        if (isArray(obj))
        {

            return Array.from(obj).map(value =>
            {
                if (isPlainObject(value) || isArray(value))
                {
                    return cloneRecursive(value);
                }
                return value;
            });
        }

        if (!isPlainObject(obj))
        {
            throw new TypeError('Invalid Object supplied.');
        }

        obj = clone(obj);
        for (let prop in obj)
        {
            if (isPlainObject(obj[prop]) || isArray(obj[prop]))
            {
                obj[prop] = cloneRecursive(obj[prop]);
            }
        }

    }

    return obj;
}


export function element2html(elem)
{
    if (isElement(elem))
    {
        elem = [elem];
    }
    if (elem instanceof NodeList)
    {
        elem = [...elem];
    }

    if (isArray(elem))
    {
        return createElement('div', elem.map(el => el.cloneNode(true))).innerHTML;
    }
}


/**
 * Creates a Document from html code
 * @param {string} html
 * @returns {documentElement}
 */
export function html2doc(html)
{
    let node = document.implementation.createHTMLDocument().documentElement;
    if (isString(html) && html.length > 0)
    {
        node.innerHTML = html;
    }
    return node;
}




/**
 * Creates an HTMLElement from html code
 * @param {string} html
 * @returns {HTMLElement|Array|undefined}
 */
export function html2element(html)
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
export function getUrl(url)
{

    if (url instanceof URL || isString(url))
    {
        let a = createElement('a', { href: url });
        return a.href;
    }
}

export function loadScript(url, options)
{
    return new Promise(resolve =>
    {
        const params = Object.assign({
            async: null,
            defer: null,
            crossorigin: null,
            referrerpolicy: null,
            type: null,
        }, options ?? {});

        let { async, defer, crossorigin, referrerpolicy, type } = params;

        if (async !== true)
        {
            async = null;
        }

        if (defer !== true)
        {
            defer = null;
        }

        if (VALID_CROSSORIGIN.includes(crossorigin))
        {
            crossorigin = null;
        }
        if (VALID_REFERERRPOLICY.includes(referrerpolicy))
        {
            referrerpolicy = null;
        }
        if (type !== 'module')
        {
            type = null;
        }

        if (url = getUrl(url))
        {

            const script = createElement('script', { src: url, onload: () => resolve(script), id: uniqid() });

            for (let param in params)
            {
                let value = params[param];
                if (null !== value)
                {
                    script[param] = value;
                }
            }

            document.getElementsByTagName('head')[0].appendChild(script);
        }

    });
}


export class BackedEnum
{


    static from(value)
    {
        return this.cases().find(x => x.value === value);
    }


    /**
     * @returns {BackedEnum[]}
     */
    static cases()
    {
        return Object.keys(this).filter(name => name === name.toUpperCase() && this[name] instanceof BackedEnum).map(x => this[x]);
    }

    get value()
    {
        return this.#value;
    }
    #value;
    constructor(value)
    {

        if (Object.getPrototypeOf(this) === BackedEnum.prototype)
        {
            throw new Error('Cannot instantiate BackedEnum directly, it must be extended.');
        }

        if (isUndef(value))
        {
            throw new TypeError('value is undefined');
        }
        this.#value = value;
    }
}


export
{
    JSON,
    global,
    document,
};
