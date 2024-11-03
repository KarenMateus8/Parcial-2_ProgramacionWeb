// Constantes
const API_KEY = 'occgdmSiY9lxjuvAcbuop6Se21N6V2vhPVZH78Yn';
const ITEMS_PER_PAGE = 25;
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos';

// Variables globales
let currentPhotos = [];
let currentPage = 1;

// Elementos del DOM
const elements = {
    dateInput: document.getElementById("earth_date"),
    photoTable: document.getElementById("tabla_fotos"),
    photoTableBody: document.querySelector("#tabla_fotos tbody"),
    photoDetailImg: document.getElementById("photo_detail_img"),
    idDetalle: document.getElementById("id_detalle"),
    solDetalle: document.getElementById("sol_detalle"),
    earthDateDetalle: document.getElementById("earth_date_detalle")
};

// Funciones de limpieza
function limpiarTabla() {
    elements.photoTableBody.innerHTML = "";
}

function limpiarDetalles() {
    elements.photoDetailImg.style.display = "none";
    elements.photoDetailImg.src = "";
    elements.idDetalle.textContent = "";
    elements.solDetalle.textContent = "";
    elements.earthDateDetalle.textContent = "";
}

// Formatear fecha para la API
function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('-');
    return `${year}-${month}-${day}`;
}

// Funciones principales
async function cargarFotos(esNuevaBusqueda = false) {
    if (esNuevaBusqueda) {
        currentPage = 1;
        limpiarTabla();
        limpiarDetalles();
    }

    const earthDate = formatearFecha(elements.dateInput.value);
    const url = `${BASE_URL}?earth_date=${earthDate}&api_key=${API_KEY}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentPhotos = data.photos;
        
        if (currentPhotos.length === 0) {
            alert('No se encontraron fotos para esta fecha. Prueba otra fecha como: 2015-07-02');
            return;
        }
        
        mostrarFotos();
        
        // Mostrar detalles del primer resultado automáticamente
        if (currentPhotos.length > 0) {
            mostrarDetalleFoto(currentPhotos[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar las fotos. Porfavor intenta nuevamente.');
    }
}

function mostrarFotos() {
    limpiarTabla();
    elements.photoTable.style.opacity = 1;

    currentPhotos.forEach(photo => {
        const row = elements.photoTableBody.insertRow();
        
        // Insertar celdas con datos
        row.insertCell(0).textContent = photo.id;
        row.insertCell(1).textContent = photo.rover.name;
        row.insertCell(2).textContent = photo.camera.name;
        
        // Crear botón de detalles
        const buttonCell = row.insertCell(3);
        const button = createDetailButton(photo);
        buttonCell.appendChild(button);
    });
}

function createDetailButton(photo) {
    const button = document.createElement('button');
    button.classList.add("btn", "btn-primary");
    button.textContent = "More";
    button.onclick = () => mostrarDetalleFoto(photo);
    return button;
}

function mostrarDetalleFoto(photo) {
    elements.photoDetailImg.src = photo.img_src;
    elements.photoDetailImg.style.display = "block";
    elements.idDetalle.textContent = photo.id;
    elements.solDetalle.textContent = photo.sol;
    elements.earthDateDetalle.textContent = photo.earth_date;
}

// Funciones de navegación
function cargarNext() {
    if (currentPhotos.length === ITEMS_PER_PAGE) {
        currentPage++;
        cargarFotos();
    }
}

function cargarPrevious() {
    if (currentPage > 1) {
        currentPage--;
        cargarFotos();
    }
}

// Inicialización
function inicializar() {
    // Establecer la fecha predeterminada
    elements.dateInput.value = "2015-07-02";
    // Cargar fotos iniciales
    cargarFotos(true);
}

// Ejecutar inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializar);