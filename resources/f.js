
```
// garde le résultat en mémoire dans cette variable si la fonction est appelée plusieurs fois
// ! ne pas l'utiliser directement, elle va etre assignée dans le futur
let cached;

// c'est le point d'entrée aux données du fichier json
async function getData()
{
    // retourne la valeur cachée ou enregistre la valeur du fetch et la retourne
    return cached ??= await fetch('./monfichier.json') // ca retourne une réponse
        .then(resp => resp.json()); // ca retourne le json parsé en object
}




// fait le fetch
getData().then(data =>
{
    gladiator.src = data.medias.movie[0].picture;
    // .... le reste
});

btn.addEventListener("click", () =>
{

    //récupère la valeur chargée en mémoire
    getData().then(data =>
    {
        // eg: change l'image
        gladiator.src = data.medias.movie[1].picture;
        // .... le reste
    });

});```;