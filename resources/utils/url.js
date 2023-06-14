
/**
 * @link https://bjornlu.com/blog/simple-svelte-routing-with-reactive-urls
 */
import { derived, writable } from "svelte/store";
const href = writable(window.location.href);
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;
const updateHref = () => href.set(window.location.href);
history.pushState = function ()
{
    originalPushState.apply(this, arguments);
    updateHref();
};
history.replaceState = function ()
{
    originalReplaceState.apply(this, arguments);
    updateHref();
};
window.addEventListener("popstate", updateHref);
// window.addEventListener("hashchange", updateHref);
export default derived(href, $href => new URL($href));

export const basePath = location.pathname.slice(0, location.pathname.lastIndexOf("/"));


export function getRoute(path)
{
    if (path.startsWith(basePath))
    {
        return path.slice(basePath.length);
    }
    return path;
}
