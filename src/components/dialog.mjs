/**
 * @link https://m2.material.io/components/dialogs/web#using-dialogs
 * @link https://getmdl.io/components/index.html#dialog-section
 */

import "./_dialog.scss";


import { isElement, createElement } from '../helpers/utils.mjs';
import EventManager from './../helpers/event-manager.mjs';
import emitter from '../helpers/emitter.mjs';

// const emulate = !(window.HTMLDialogElement || (document.createElement('dialog')).showModal);


// console.debug("emulate", emulate, window.HTMLDialogElement, (document.createElement('dialog')).showModal);






const DIALOG_ATTRIBUTES = {
    role: "dialog",
    id: "dialog%index%",
    "aria-labelledby": "%id%Title",
    "aria-describedby": "%id%Desc",
}, dialogs = new Set();





function createDialogBox({ title, content, id } = {})
{

    title ??= '';
    content ??= '';
    id ??= 'dialog' + dialogs.size;




    let dialog, form, cancel, ok, close;

    dialog = createElement('dialog', {

        id,
        title,



    }, [

        createElement('form', {
            id: id + 'Form',
            action: 'dialog',
            onsubmit: e =>
            {
                e.preventDefault();
                console.dir(e);
            }
        })

    ]);


    return dialog;

}








export default class Dialog
{

    element;

    attachTo(elem)
    {
        if (isElement(elem))
        {

        }
    }


    get open()
    {
        return this.element.open;
    }




    show()
    {

    }
    showModal()
    {

    }

    close(value)
    {

        this.element.close(value);
    }


    constructor(elem)
    {
        this.element = elem ??= document.createElement('dialog');
        #emitter = emitter(elem);

        if (!isElement(elem))
        {
            throw new TypeError("elem is not an Element");
        }



        EventManager.mixin(this);





    }


}