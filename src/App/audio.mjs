import { writable } from "svelte/store";
import LocalStore from "../../modules/stores/webstore.mjs";
import { BackedEnum, getUrl, isElement } from "../../modules/utils/utils.mjs";



const PATH = '/assets/sound/', EXT = '.ogg';

const players = new Map();


/**
 * Hook to mute sound
 */


export const muted = LocalStore.hook('soundMuted', false);

export const playIntro = writable(false);


function playAudio(el)
{
    if (isElement(el))
    {
        el.currentTime = 0;
        if (el.paused && !el.muted)
        {
            el.play();
        }
    }
}




export default class SoundTrack extends BackedEnum
{


    static INTRO = new SoundTrack('intro');
    static ERROR = new SoundTrack('error');
    static SUCCESS = new SoundTrack('victory');



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
        playAudio(this.player);
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

