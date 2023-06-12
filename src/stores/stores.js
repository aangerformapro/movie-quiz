
import { readable, writable } from 'svelte/store';
import LocalStore from './../src/stores/webstore.mjs';




// export const name = writable(LocalStore.getItem('name'), set =>
// {

//     // set(LocalStore.getItem("name"));
//     console.debug("start", set);
//     const unsubscribe = LocalStore.subscribe("name", value =>
//     {

//         console.debug("sub", value);
//         set(value);
//     });
//     name.subscribe(value =>
//     {
//         LocalStore.setItem("name", value);
//     });
//     return unsubscribe;
// });


export const name = writable(LocalStore.getItem('name'), set =>
{

    return LocalStore.subscribe('name', value =>
    {
        set(value);
    });
});


name.subscribe(value =>
{
    LocalStore.setItem("name", value);
});

const localdata = await fetch("./localapi.json").then(d => d.json());

export const localapi = readable(localdata);


// current entry loaded into localstorage

let current = LocalStore.getItem("current", () =>
{
    return localdata.movies[0];
});

export const currentMedia = writable(current, set =>
{
    return LocalStore.subscribe("current", v => set(v));
});

