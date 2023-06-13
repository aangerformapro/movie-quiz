
/**
 * A simple router to route Static pages
 * Only route html pages
 */

import { noop } from "../utils/utils.mjs";




const routes = new Map();


export class Route
{
    name = '';
    path = '';
    params = {};
    fn = noop;

}


export default class Router
{


    get routes()
    {
        return routes.get(this);
    }


    get(path, fn)
    {

    }


    urlFor(/** @param {string} */name, params = {})
    {

    }








}