/**
 * @link https://m2.material.io/components/dialogs/web#using-dialogs
 * @link https://getmdl.io/components/index.html#dialog-section
 */

import "./_dialog.scss";


import { isElement, createElement, decode, encode, isEmpty, isString, isArray, BackedEnum } from '../helpers/utils.mjs';

import icons from './sprite.mjs';
import NoScroll from './noscroll.mjs';
import HtmlComponent from "./html.mjs";


const dialogs = new Set();


function findClosest(target, ...parents)
{

    do
    {
        if (parents.some(p => p === target))
        {
            return true;
        }
    } while (target = target.parentElement);
    return false;
}


function createDialogBox({
    title, content, id, idTitle, idDesc,

} = {})
{

    title ??= '';
    content ??= '';
    id ??= 'dialog' + dialogs.size;
    idTitle ??= id + "Title";
    idDesc ??= id + "Desc";



    let dialog, form, cancel, ok, close, titleEl, contentEl,
        closeIcon = icons.close.generate(),
        validIcon = icons.done.generate(),
        dismissIcon = icons.backspace.generate();


    [closeIcon, validIcon, dismissIcon]
        .forEach(item => item.setAttributes({ width: "20px", height: "20px" }));


    dialog = createElement('dialog', {

        id,
        title,
        role: 'dialog',
        aria: {
            labelledby: idTitle,
            describedby: idDesc,
        },
        class: 'ng-dialog',

    }, [

        form = createElement('form', {
            id: id + 'Form',
            class: 'ng-dialog--form',
            method: 'dialog',

        }, [

            createElement('<div class="ng-dialog--heading"/>', [
                titleEl = createElement('h4', {
                    id: idTitle,
                }, title),
                close = createElement('<button type="button" title="Close" value="close"/>', {
                }, closeIcon.element),
            ]),
            contentEl = createElement('<div class="ng-dialog--contents"/>', {
                id: idDesc,
            }, content),
            createElement('<div class="ng-dialog--footer"/>', [

                cancel = createElement('<button value="close" title="Cancel" type="reset"/>', [
                    dismissIcon.element,
                ]),


                ok = createElement('<button value="ok" title="Ok" type="submit"/>', [
                    validIcon.element,
                ]),

            ])

        ])

    ]);


    return {
        dialog,
        form,
        content: contentEl,
        title: titleEl,
        close, cancel, ok,

    };

}



export class Position extends BackedEnum
{

    static TOP = new Position('pos-top');
    static LEFT = new Position("pos-left");
    static RIGHT = new Position("pos-right");
    static BOTTOM = new Position("pos-bottom");
    static CENTER = new Position("pos-center");
}


export default class Dialog extends HtmlComponent
{


    #backdrop;


    set backdropCloses(flag)
    {
        this.#backdrop = flag === true;
    }


    get backdropCloses()
    {
        return this.#backdrop !== false;
    }


    set canCancel(flag)
    {
        this.elements.cancel.hidden = flag === true ? null : true;
    }
    get canCancel()
    {
        return this.elements.cancel.hidden === null;
    }


    set canClose(flag)
    {
        this.elements.close.hidden = flag === true ? null : true;
    }
    get canClose()
    {
        return this.elements.close.hidden === null;
    }


    set content(value)
    {

        if (isString(value))
        {
            value = [value];
        } else if (isElement(value))
        {
            value = [value];
        }

        if (isArray(value))
        {
            this.elements.content = '';
            value.forEach(html =>
            {
                if (isString(html))
                {
                    this.elements.content += html;
                } else if (isElement(value))
                {
                    this.elements.content.appendChild(html);
                }

            });
        }

    }

    get content()
    {
        return this.elements.content;
    }


    get returnValue()
    {
        return decode(this.element.returnValue || false);
    }


    get title()
    {
        return this.elements.title.innerHTML;
    }

    set title(value)
    {
        this.elements.title.innerHTML = encode(value);
    }

    #position;
    get position()
    {
        return this.#position;
    }

    set position(value)
    {
        if (value instanceof Position)
        {
            value = [value];
        }


        if (isArray(value))
        {
            value = value.filter(v => v instanceof Position);
            this.#position = value;
            this.element.classList.remove(...Position.cases().map(x => x.value));
            this.element.classList.add(...value.map(x => x.value));
        }
    }





    set returnValue(value)
    {
        this.element.returnValue = encode(value);
    }




    get open()
    {
        return this.element.open;
    }



    elements;

    formdata;


    show()
    {
        return new Promise(resolve =>
        {

            this.one('close', e =>
            {
                resolve(this.returnValue);
            });


            if (!this.open)
            {
                if (!this.isAttached)
                {
                    this.attachTo(document.body);
                }
            }

            this.element.show();

        });


    }
    showModal(backdropClose)
    {


        return new Promise(resolve =>
        {


            this.one('close', e => resolve(this.returnValue));


            if (!this.open)
            {
                if (!this.isAttached)
                {
                    this.attachTo(document.body);
                }

                if (backdropClose ??= this.backdropCloses)
                {

                    const listener = e =>
                    {

                        if (!findClosest(e.target, this.elements.form))
                        {
                            this.off('click', listener);
                            this.close(false);
                        }

                    };

                    this.on('click', listener);
                }


                NoScroll.enable().then(() =>
                {
                    this.element.showModal();
                });
            }
        });

    }

    close(value)
    {



        if (!this.open)
        {
            return Promise.resolve(value);
        }

        return new Promise(resolve =>
        {
            const { element } = this;

            element.classList.add("closing");

            setTimeout(() =>
            {

                element.close(encode(value));
                element.classList.remove("closing");
                resolve(value);
            }, 550);

        });


    }


    constructor(content, title, id)
    {


        const elements = createDialogBox({ title, content, id });

        super(elements.dialog);

        this.elements = elements;

        this.formdata = new FormData(elements.form);
        dialogs.add(this);

        this.#position = [Position.CENTER];

        this.on('click', e =>
        {

            const { target } = e;

            if (findClosest(target, elements.close))
            {
                e.preventDefault();
                this.close(false);
            }

        }).on('submit', e =>
        {
            e.preventDefault();
            const data = { ...this.formdata };
            this.close(isEmpty(data) ? true : data);
        }).on('reset', e =>
        {
            e.preventDefault();

            elements.form.reset();
            this.close(false);
        }).on('close', e =>
        {
            NoScroll.disable();
        });


    }


}



let d = new Dialog('Voici les règles du jeu.', document.title);

d.position = [
    Position.TOP,
    Position.RIGHT,
];
d.canCancel = d.canClose = d.backdropCloses = false;
d.showModal();

console.dir(d);

d.title = 'New Title';