<script>
    import { useParams } from "svelte-navigator";

    const params = useParams();

    $: console.debug($params);
</script>
