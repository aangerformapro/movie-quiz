<script>
    import { onMount } from "svelte";
    import { Notification, getAvailableTitles, notify } from "../App/game.mjs";
    import { stringSimilarity } from "string-similarity-js";
    import { removeAccent } from "../../modules/utils/utils.mjs";
    export let item;

    let validResults = [],
        value = "",
        normalized = "",
        disabled = true;

    // Notification

    function handleInput() {
        disabled = !value.length;
        normalized = removeAccent(value.toLowerCase());
        if ($notify !== Notification.NONE) {
            $notify = Notification.NONE;
        }
    }

    function handleSubmit() {
        if (
            validResults
                .map((valid) => stringSimilarity(valid, normalized))
                .some((result) => result > 0.9)
        ) {
            Notification.SUCCESS.display();
        } else {
            Notification.FAILURE.display();
        }

        console.debug(
            validResults.map((valid) => [
                stringSimilarity(valid, normalized),
                valid,
                normalized,
            ])
        );
    }

    function initialize() {
        value = "";
        validResults = getAvailableTitles(item);
    }
    $: initialize();

    onMount(() => {
        initialize();
    });
</script>

{#if item}
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
                    <button type="submit" title="Valider" {disabled} class="">
                        <i class="ng-done" size="20" />
                    </button>
                    <span class="input--bar" />
                </div>
            </div>
        </div>
    </form>
{/if}
