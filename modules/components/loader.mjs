import { isInt, isUnsignedInt } from "../helpers/utils.mjs";
import { EventManager } from './../helpers/event-manager';




export class Progress
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


