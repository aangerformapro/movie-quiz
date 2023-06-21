<script>
    import { onMount } from "svelte";

    export let item;

    let value = "";

    onMount(() => {
        console.debug(item);
    });
</script>

{#if item && item.id}
    <form
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
                        {value}
                        placeholder="Entrez un nom de film ou de série"
                        class=""
                        autocomplete="off"
                        required
                    />
                    <span class="input--placeholder">
                        Entrez un nom de film ou de série
                    </span>
                    <span class="input--bar" />
                </div>
                <div class="input--group btn-submit">
                    <button type="submit" title="Valider" disabled class="">
                        <i class="ng-done" size="20" />
                    </button>
                    <span class="input--bar" />
                </div>
            </div>
        </div>
    </form>
{/if}
