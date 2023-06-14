
import { readable } from "svelte/store";
import Router from "../../modules/components/router.mjs";
import History from "../../modules/components/history.mjs";
import { getUrl } from "../../modules/utils/utils.mjs";




export const route = readable(Router.route, set =>
{

    Router.start(v => set(v));
});

export const href = readable(new URL(location.href), set =>
{
    return History.onChange(e =>
    {
        set(getUrl(e.data.url));
    });
});



