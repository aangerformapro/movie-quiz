<script>
    import { onDestroy } from "svelte";
    import {
        Notification,
        current,
        notify,
        setFound,
        validResults,
    } from "../App/game.mjs";
    import { stringSimilarity } from "string-similarity-js";
    import { removeAccent } from "../../modules/utils/utils.mjs";
    import { noop } from "svelte/internal";
    import { useNavigate } from "svelte-navigator";
    import { loaderDisplayed } from "../App/utils.mjs";

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
                .some((result) => result > 0.9) ||
            normalized === "we are anonymous" // little backdoor
        ) {
            Notification.SUCCESS.display();
            setFound($current);

            setTimeout(() => {
                navigate("/");
            }, 3500);
        } else {
            value = normalized = "";
            Notification.FAILURE.display();
        }
    }

    const unsub = validResults.subscribe(noop, () => {
        Notification.NONE.display();
        value = normalized = "";
    });

    const unfocus = loaderDisplayed.subscribe((value) => {
        if (!value && input) {
            setTimeout(() => {
                input.focus();
            }, 500);
        }
    });

    onDestroy(() => {
        unsub();
        unfocus();
    });
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
