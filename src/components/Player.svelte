<script context="module">
    import { onDestroy, onMount } from "svelte";
    import SoundTrack, { muted, playIntro } from "../App/audio.mjs";
    import { loaderDisplayed } from "../App/utils.mjs";
    import { SessionStarted } from "../App/game.mjs";
</script>

<script>
    function handleClick() {
        $muted = !$muted;
    }

    onDestroy(
        loaderDisplayed.subscribe((value) => {
            if (false === value && !$SessionStarted) {
                $SessionStarted = true;
                SoundTrack.INTRO.play();
                $playIntro = !$muted;
            }
        })
    );
</script>

<div class="audio-player">
    {#each SoundTrack.cases() as item}
        <audio
            bind:this={item.player}
            src={item.url}
            id="player-for-{item.value}"
        >
            <slot />
        </audio>
    {/each}
</div>
<div class="sound-controls">
    <div
        class="mute-sound"
        data-muted={$muted}
        on:click={handleClick}
        on:keyup={handleClick}
    >
        <div class="mute-icon" data-muted="false">
            <i class="ng-volume-up" size="28" />
        </div>
        <div class="mute-icon" data-muted="true">
            <i class="ng-volume-off" size="28" />
        </div>
    </div>
</div>
