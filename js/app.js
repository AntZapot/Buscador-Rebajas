// Selectores formularios
const formulario = document.querySelector('#formulario');
const formularioFiltros = document.querySelector('#filtros');

// Selectores filtos
const busquedaJuego = document.querySelector('#busqueda-juego');
const ordenarSelect = document.querySelector('#select-ordenar');
const precioBajo = document.querySelector('#precio-bajo');
const precioAlto = document.querySelector('#precio-alto');

// Selectores template
const template = document.querySelector('#template').content;
const fragment = document.createDocumentFragment();
const resultados = document.querySelector('#resultados');

// Pagiador
const paginador = document.querySelector('#paginas')
const pagina = document.querySelector('.pagina')

const objBusqueda = {
    juego: '',
    minimo: '0',
    maximo: '50',
    ordenar: '',
    pagina: 1
}

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarFormulario);
    formularioFiltros.addEventListener('submit', validarFormulario);

    // Añadir valores al objeto de busqueda
    busquedaJuego.addEventListener('change', agregarObj);
    ordenarSelect.addEventListener('change', agregarObj);
    ordenarSelect.addEventListener('change', consultarAPI);
    precioBajo.addEventListener('change', agregarObj);
    precioAlto.addEventListener('change', agregarObj);

})

function agregarObj(e) {
    objBusqueda[e.target.name] = e.target.value
}

function validarFormulario(e) {
    e.preventDefault();

    limpiarHTML();  

    const busqueda = document.querySelector('#busqueda-juego').value;

    if(busqueda === ''){
        mostrarAlerta('Añade el nombre del videojuego');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(mensaje) {
    // Mostrar mensaje de alerta solo si no existe uno previo
    const existeAlerta = document.querySelector('.alerta');
    if(!existeAlerta) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('alerta');
        divAlerta.textContent = mensaje;

        resultados.appendChild(divAlerta); 
        
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while(resultados.firstChild) {
        resultados.removeChild(resultados.firstChild);
    }
}

function consultarAPI() {
    limpiarHTML();

    const {juego, minimo, maximo, ordenar, pagina} = objBusqueda;
    url = `https://www.cheapshark.com/api/1.0/deals?&title=${juego}&sortBy=${ordenar}&lowerPrice=${minimo}&upperPrice=${maximo}&pageNumber=${pagina}`

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( juegos => mostrarJuegos(juegos));
}

function mostrarJuegos(juegos) {
    limpiarHTML();
    if(juegos.length === 0) {
        mostrarAlerta('No se encontraron resultados');
        const pagina = document.querySelector('.siguiente')
        const paginaAnterior = document.querySelector('.anterior')
        pagina.remove()
        paginaAnterior.remove()
        return;
    }

    // Iterar sobre cada objeto y llenar el template con sus datos
    juegos.forEach(juego => {

        const {thumb, title, metacriticScore, normalPrice, salePrice, dealID} = juego;
        
        const clone = template.cloneNode(true);
        clone.querySelector('#imagen').src = thumb;
        clone.querySelector('#titulo').textContent = title;
        clone.querySelector('#precio-normal').textContent = `Precio normal: ${normalPrice}`;
        clone.querySelector('#precio-oferta').textContent = `Precio oferta: ${salePrice}`;
        
        // Asignar metacritic
        if(metacriticScore === '0') {
            clone.querySelector('#metacritic').textContent = "Sin calificar";
        }else {
            clone.querySelector('#metacritic').textContent = metacriticScore;
        }

        // generar link a la tienda de cheapShark
        clone.querySelector('#ver-mas').href = `https://www.cheapshark.com/redirect?dealID=${dealID}`;

        fragment.appendChild(clone)
    });

    resultados.appendChild(fragment)
    crearPaginador();
}

function crearPaginador() {
    const existePaginaSiguiente = document.querySelector('.siguiente');

    if(!existePaginaSiguiente){
        const pagina = document.createElement('a');
        pagina.classList.add('pagina', 'siguiente');
        pagina.textContent = 'Siguiente'

        paginador.appendChild(pagina)

        // Siguiente pagina
        pagina.addEventListener('click', cambiarPagina)
    }
}

function cambiarPagina(e) {
    if(e.target.textContent === 'Siguiente') {
        objBusqueda.pagina++;
    }else if(objBusqueda.pagina !== 1){
        objBusqueda.pagina--;
    }

    const existePaginaAnterior = document.querySelector('.anterior')
    
    if(objBusqueda.pagina !== 1) {
        if(!existePaginaAnterior) {
            const paginaAnterior = document.createElement('a');
            paginaAnterior.classList.add('pagina', 'anterior');
            paginaAnterior.textContent = 'Anterior'
    
            paginador.insertAdjacentElement("afterBegin", paginaAnterior)

            paginaAnterior.addEventListener('click', cambiarPagina)
        }
    } else{
        paginador.removeChild(paginador.firstChild)
    }

    consultarAPI()
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    resultados.appendChild(spinner)
}