<script>
    import { notify, Notification } from "../App/game.mjs";
</script>

<div class="notify-area position-absolute top-0 start-0 end-0">
    {#if $notify === Notification.SUCCESS}
        <div class="notification">bonne réponse</div>
    {:else if $notify === Notification.FAILURE}
        <div class="notification">mauvaise réponse</div>
    {/if}
</div>
