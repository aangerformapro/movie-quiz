
/**
 * A simple router to route Static pages
 * Only route html pages
 */

import { decode, encode, getUrl, isArray, isEmpty, isFunction, isString, noop, uniqid } from "../utils/utils.mjs";
import History, { RouterEvent } from "./history.mjs";

/**
 * Base Path
 */
export let base = '';




const routes = new Set();
let started = false;


function getParams(url)
{

    const params = {}, search = getUrl(url).searchParams;

    for (const key of search.keys())
    {
        params[key] = search.getAll(key)
            .map(val => decode(val));
        if (params[key].length === 1)
        {
            params[key] = params[key][0];
        }
    }

    return params;
}


export class Route
{
    name = 'notfound';
    path = '*';
    params = [];
    fn;


    constructor({ path, name, params, fn } = {})
    {

        if (isString(path))
        {
            this.path = path;
        }

        if (isString(name))
        {
            this.name = name;
        }

        if (isArray(params))
        {
            this.params.push(...params);
        }

        if (isFunction(fn))
        {
            this.fn = fn;
        }
    }


    matches(path)
    {
        return path.slice(base.length) === this.path || this.path === '*';
    }








    run(url)
    {

        if (this.fn)
        {
            const
                { fn } = this,
                params = getParams(url),
                matchedParams = this.params.map(key => params[key] ??= null);

            return fn(...matchedParams, params);
        }


    }


    urlFor(params = {})
    {


        if ('*' === this.path)
        {
            return new URL(location.href);
        }


        let path = getUrl(base + this.path), search = path.URLSearchParams;


        for (let key in params)
        {
            let value = params[key];

            if (!isArray(value))
            {
                value = [value];
            }

            value.forEach(val => search.append(key, encode(val)));
        }

        return path.href;
    }



}


const DEFAULT_ROUTE = new Route();



export default class Router
{


    static get basePath()
    {
        return base;
    }


    static set basePath(value)
    {

        if (!isEmpty(value) && !value.startsWith("/"))
        {
            throw new TypeError("basepath " + value + ' is incorrect.');
        }

        while (value.endsWith("/"))
        {
            value = value.slice(0, -1);
        }

        base = value;

    }



    static get route()
    {

        const url = getUrl(location.href);

        for (let route of routes)
        {
            if (route.matches(url.pathname))
            {
                return route;
            }
        }
        return DEFAULT_ROUTE;
    }




    static get routes()
    {
        return routes;
    }


    static get(path, fn, name, params = [])
    {


        if (!isString(name ??= uniqid()))
        {
            throw new TypeError('Your route must be named');
        }


        if (isString(path))
        {
            path = [path];
        }

        if (!isArray(path))
        {
            throw new TypeError("path must be a String|String[]");
        }

        path.forEach(p => routes.add(new Route({ path: p, fn, name, params })));

        return this;
    }


    static urlFor(/** @param {string} */name, params = {})
    {
        const route = this.getRoute(name);

        if (!route)
        {
            throw new Error('invalid route ' + name);
        }
        return route.urlFor(params);
    }




    static getRoute(name)
    {

        for (let route of routes)
        {
            if (route.name === name)
            {
                return route;
            }
        }


        return new Route();
    }

    static goto(route, params = {}, push = true)
    {
        if (!started)
        {
            return;
        }

        if (isString(route))
        {
            route = this.getRoute(route);
        }

        if (route instanceof Route === false)
        {
            throw new TyperError("invalid route");
        }

        const url = route.urlFor(params);
        if (push)
        {
            history.pushState(url, '', url);
        } else
        {
            location.href = url.href;
        }

        return route;
    }


    static start(fn = noop)
    {


        let route = this.route, url = getUrl(location.href);

        fn(route, url);
        route.run(url);


        const detach = History.onPush(e =>
        {
            url = getUrl(e.data.url);
            route = this.route;
            fn(route, url);
            route.run(url);
        });

        if (!started)
        {
            started = true;
            History.start(RouterEvent.PUSH);
        }

        return detach;

    }






}