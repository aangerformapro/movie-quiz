<script>
    import { onDestroy } from "svelte";
    import SoundTrack, { muted } from "../App/audio.mjs";
    import { notify, Notification } from "../App/game.mjs";

    import { useNavigate } from "svelte-navigator";
    const navigate = useNavigate();

    onDestroy(
        notify.subscribe((value) => {
            if (value === Notification.SUCCESS) {
                if (!$muted) {
                    SoundTrack.SUCCESS.play().then(() =>
                        navigate("/", { replace: true })
                    );
                } else {
                    setTimeout(navigate, 3500, "/", { replace: true });
                }
            } else if (value === Notification.FAILURE) {
                SoundTrack.ERROR.play();
            }
        })
    );
</script>

<div class="notify-area position-absolute top-0 start-0 end-0">
    {#if $notify === Notification.SUCCESS}
        <div class="notification">bonne réponse</div>
    {:else if $notify === Notification.FAILURE}
        <div class="notification">mauvaise réponse</div>
    {/if}
</div>
