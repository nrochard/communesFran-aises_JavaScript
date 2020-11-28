let displayEmptyName = document.querySelector(".emptyName");
let displaybadCity = document.querySelector(".badCity");
let nbResult = document.querySelector(".nbResult");
let displayResult = document.querySelector(".displayResult");
let displayTooResult = document.querySelector(".tooResult");

// Afficher la date en haut de l'application
let dateToday = new Date();

let dateLocale = dateToday.toLocaleString('fr-FR',{
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'});

document.querySelector(".dateToday").innerHTML  = `Nous sommes le ${dateLocale}` ;

// Récupérer le nom de la ville au clic sur le bouton
document.querySelector(".btn").addEventListener("click", () => {

    // Reset le contenu à chaque requête
    document.querySelector(".displayResult").innerHTML = "";

    let nameCity = document.querySelector(".form-control").value;

    // Gestion d'erreur pour un champs vide
    if (!nameCity){
        displayEmptyName.style.display = "block";
        return;
    }
    else{
        displayEmptyName.style.display = "none";
    }

    axios
    .get("https://geo.api.gouv.fr/communes?nom=" + nameCity + "&boost=population&fields=nom,code,codesPostaux,codeDepartement,departement,region,population")
    .then((response) =>{
        console.log(response.data)



        // Gestion d'erreur pour un nom de commune incorrect
        response.data.length == 0 ? displaybadCity.style.display = "block" : displaybadCity.style.display = "none";

        // Afficher le nombre de résultat en fonction du pluriel
        response.data.length == 1 ? nbResult.innerHTML = "Il y a " + response.data.length + " résultat." : nbResult.innerHTML = "Il y a " + response.data.length + " résultats.";

        // Gestion d'erreur personelle pour gérer quand il y a trop de résultat
        if (response.data.length > 20 ){
            displayTooResult.style.display = "block"
        return;
        }
        else{
            displayTooResult.style.display = "none";
        } 

        // Une belle boucle foreach pour afficher les infos de la commune avec une variable incrémenté pour les dissocier
        let i = 0;
        response.data.forEach(element => {
            displayResult.insertAdjacentHTML("beforeend", `<ul class="ulList infoCity${i}"><h3 class="whichResult">Résultat n°${i +1} :</h3></ul>`)
            let infoCity = document.querySelector(`.infoCity${i}`);
            infoCity.insertAdjacentHTML("beforeend", `<li><span>Nom : </span>${element.nom}</li>`)
            infoCity.insertAdjacentHTML("beforeend", `<li><span>Nombre d'habitants : </span>${new Intl.NumberFormat().format(element.population)}</li>`)
            infoCity.insertAdjacentHTML("beforeend", `<li><span>Région : </span>${element.region.nom}</li>`)
            infoCity.insertAdjacentHTML("beforeend", `<li><span>Département : </span>${element.departement.nom}</li>`)
            element.codesPostaux.length > 1 ? infoCity.insertAdjacentHTML("beforeend", `<li class="wrap"><span>Codes postaux : </span>${element.codesPostaux}</li>`) : infoCity.insertAdjacentHTML("beforeend", `<li class="wrap"><span>Code postal : </span>${element.codesPostaux}</li>`);
            infoCity.insertAdjacentHTML("beforeend", `<li><span>Code du département : </span>${element.departement.code}</li>`)
            i++;
        });
    });
    
});
