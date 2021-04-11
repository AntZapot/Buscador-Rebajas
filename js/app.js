const formulario = document.querySelector('#formulario');
const input = document.querySelector('#busqueda')
const template = document.querySelector('#template').content;
const fragment = document.createDocumentFragment();
const resultados = document.querySelector('#resultados')

document.addEventListener('DOMContentLoaded', () => {
    consultarMejoresOfertas();
    // formulario.addEventListener('submit', consultarAPI)
})

function consultarMejoresOfertas() {
    url = `https://www.cheapshark.com/api/1.0/deals?&desc=true`

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( juegos => mostrarJuegos(juegos) )
}

function mostrarJuegos(juegos) {
    console.log(juegos)
    juegos.forEach(juego => {
        const {thumb, title, metacriticScore, normalPrice, salePrice} = juego;
        const clone = template.cloneNode(true);
        clone.querySelector('#titulo').textContent = title;
        clone.querySelector('#titulo').textContent = title;

        fragment.appendChild(clone)
    });

    resultados.appendChild(fragment)
//     resultados.innerHTML = '';
//     Object.values(juegos).forEach(juego => {
//         const {thumb, title, metacriticScore, normalPrice, salePrice} = juego;
//         console.log(juegos.title)
//         const clone = template.cloneNode(true);
//         clone.querySelector('h2').textContent = title;

//         fragment.appendChild(clone)
//     });

//     resultados.appendChild(fragment)
    
}