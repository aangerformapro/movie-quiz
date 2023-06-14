
/**
 * A simple router to route Static pages
 * Only route html pages
 */

import { decode, encode, getUrl, isArray, isEmpty, isFunction, isString, noop } from "../utils/utils.mjs";
import History, { RouterEvent } from "./history.mjs";




const routes = new Set(), listeners = new Set();


export let base = '';

let started = false;

export class Route
{
    name = '*';
    path = '*';
    params = [];
    fn = noop;


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



    getParams(url)
    {

        const params = new Map();
        for (const [key, value] of getUrl(url).searchParams)
        {
            params.set(key, decode(value));
        }

        return params;
    }




    run(url)
    {
        const params = this.getParams(url);
        this.fn(...this.params.map(p => params.get(p)), params);
    }


    urlFor(params = {})
    {

        let path = base + this.path;

        if (!isEmpty(params))
        {

            const search = new URLSearchParams();
            for (let key in params)
            {
                let value = encode(params[key]);
                search.set(key, value);
            }

            path += '?' + search.toString();
        }

        return path;
    }



}




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

        const url = getUrl(location.href), path = url.pathname;

        for (let route of routes)
        {

            if (route.matches(url.pathname))
            {
                return route.name;
            }
        }

    }




    static get routes()
    {
        return routes;
    }


    static get(path, fn, name, params = [])
    {

        if (!isString(name))
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

        path.forEach(p => routes.add(new Route({ p, fn, name, params })));

        return this;
    }


    static urlFor(/** @param {string} */name, params = {})
    {
        const route = getRoute(name);

        if (!route)
        {
            throw new Error('invalid route ' + name);
        }
        return route.urlFor(params);
    }




    getRoute(name)
    {

        for (let route of routes)
        {
            if (route.name === name)
            {
                return route;
            }
        }
    }

    goto(route, params = {}, push = true)
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




    static start(fn)
    {

        if (!isFunction(fn))
        {
            throw new TypeError("fn is not a Function");
        }

        const detach = History.onPush(e =>
        {


            const url = getUrl(e.data.url);


            for (let route of routes)
            {

                if (route.matches(url.pathname))
                {
                    fn(route, url);
                    route.run(url);

                    return;

                }
            }


            fn(new Route(), _url);


        });

        if (!started)
        {

            started = true;
            History.start(RouterEvent.PUSH);
        }

        return detach;

    }






}