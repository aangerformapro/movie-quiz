<script>
    import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
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

    let value = "",
        normalized = "";

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
                .some((result) => result > 0.9)
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

    // $: console.debug($validResults);

    const unsub = validResults.subscribe(noop, () => {
        Notification.NONE.display();
        value = normalized = "";
    });

    onDestroy(() => {
        unsub();
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
