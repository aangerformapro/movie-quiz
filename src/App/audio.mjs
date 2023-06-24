import { get, writable } from "svelte/store";
import LocalStore from "../../modules/stores/webstore.mjs";
import { BackedEnum, getUrl, isElement } from "../../modules/utils/utils.mjs";
import { WinningStreak } from "./game.mjs";



const PATH = '/assets/sound/', EXT = '.ogg';

const players = new Map();


/**
 * Hook to mute sound
 */

export const muted = LocalStore.hook('soundMuted', false);

export const playIntro = writable(false);


function playAudio(el)
{

    return new Promise((resolve, reject) =>
    {
        if (isElement(el))
        {
            el.currentTime = 0;

            setTimeout(() =>
            {
                resolve(el);
            }, (el.duration * 1000) + 200);

            if (el.paused && !el.muted)
            {
                // chrome 2018 forbade autoplay and throws error
                try
                {
                    el.play();
                } catch (err)
                {
                    console.warn(err);
                }
            }
            else
            {
                resolve(el);
            }

        } else
        {
            reject(new TypeError("not an element"));
        }


    });

}




export default class SoundTrack extends BackedEnum
{

    /**
     * Intro sound
     */
    static INTRO = new SoundTrack('intro');

    /**
     * Victory Sounds
     */
    static SUCCESS = new SoundTrack('success');
    static VICTORY = new SoundTrack("victory");


    /**
     * Errors Sounds
     */
    static ERROR = new SoundTrack('error');
    static NASTY = new SoundTrack("nasty");
    static WRONG = new SoundTrack("wrong");


    static get errorSound()
    {

        const
            choises = ['error', 'nasty', 'wrong'],
            key = Math.floor(Math.random() * choises.length);
        return this.from(choises[key]);
    }

    static get victorySound()
    {
        const streak = get(WinningStreak);
        if (streak && streak % 10 === 0)
        {
            return this.VICTORY;
        }
        return this.SUCCESS;
    }




    get url()
    {
        return getUrl(PATH + this.value + EXT);
    }


    set player(el)
    {
        players.set(this, el);
        muted.subscribe(value =>
        {
            el.muted = value ? value : null;
        });

    }

    get player()
    {
        return players.get(this);
    }


    play()
    {
        return playAudio(this.player);
    }


    pause()
    {
        this.player?.pause();
    }


    destroy()
    {
        this.pause();
        players.delete(this);
    }
}

