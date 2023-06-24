<script>
    import { onDestroy } from "svelte";
    import {
        Notification,
        WinningStreak,
        current,
        notify,
        setFound,
        validResults,
    } from "../App/game.mjs";
    import { stringSimilarity } from "string-similarity-js";
    import { removeAccent } from "../../modules/utils/utils.mjs";
    import { noop, run_all } from "svelte/internal";

    import { loaderDisplayed } from "../App/utils.mjs";
    import SoundTrack from "../App/audio.mjs";
    import { useNavigate } from "svelte-navigator";

    let value = "",
        normalized = "",
        input;

    const navigate = useNavigate();

    function handleInput() {
        normalized = removeAccent(value.toLowerCase());
        if ($notify !== Notification.NONE) {
            $notify = Notification.NONE;
        }
    }

    function handleSubmit() {
        if (
            $validResults
                .map((valid) => stringSimilarity(valid, normalized))
                .some((result) => result > 0.82)
        ) {
            Notification.SUCCESS.display();
            WinningStreak.increment();

            SoundTrack.victorySound.play().then(() => {
                Notification.NONE.display();
                setFound($current);
                navigate("/", { replace: true });
            });
        } else {
            setTimeout(() => {
                Notification.NONE.display();
            }, 3000);

            WinningStreak.clear();
            value = normalized = "";
            Notification.FAILURE.display();
            SoundTrack.errorSound.play();
        }
    }

    onDestroy(
        validResults.subscribe(noop, () => {
            Notification.NONE.display();
            value = normalized = "";
        })
    );

    onDestroy(
        loaderDisplayed.subscribe((value) => {
            if (!value && input) {
                setTimeout(() => {
                    input.focus();
                }, 500);
            }
        })
    );
</script>

{#if $validResults.length}
    <form
        on:submit|preventDefault={handleSubmit}
        method="post"
        id="input-movie-title"
        name="input-movie-title"
        class=""
        novalidate
    >
        <div class="form--input">
            <label for="user-input col-lg-5"> Votre Proposition: </label>
            <div class="input--mix col-lg-7">
                <div class="input--group input-text">
                    <input
                        type="text"
                        name="user-input"
                        id="user-input"
                        placeholder="Entrez un nom de film ou de série"
                        class=""
                        autocomplete="off"
                        required
                        bind:value
                        on:input={handleInput}
                        bind:this={input}
                    />
                    <span class="input--placeholder">
                        Entrez un nom de film ou de série
                    </span>
                    <span class="input--bar" />
                </div>
                <div class="input--group btn-submit">
                    <button
                        type="submit"
                        title="Valider"
                        disabled={!value.length}
                        class=""
                    >
                        <i class="ng-done" size="20" />
                    </button>
                    <span class="input--bar" />
                </div>
            </div>
        </div>
    </form>
{/if}
