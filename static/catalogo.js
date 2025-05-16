// Lista de armas con información ficticia
const armas = [
    { nombre: "AK-47", descripcion: "Rifle automático de asalto", categoria: "rifle", tipo: "automatica", precio: "$1,200 USD", imagen: "https://via.placeholder.com/300x200" },
    { nombre: "M16", descripcion: "Rifle de asalto de largo alcance", categoria: "rifle", tipo: "semi-automatica", precio: "$1,300 USD", imagen: "https://via.placeholder.com/300x200" },
    { nombre: "Desert Eagle", descripcion: "Pistola semiautomática de gran potencia", categoria: "pistola", tipo: "semi-automatica", precio: "$800 USD", imagen: "https://via.placeholder.com/300x200" },
    { nombre: "Glock 19", descripcion: "Pistola compacta de autodefensa", categoria: "pistola", tipo: "semi-automatica", precio: "$600 USD", imagen: "https://via.placeholder.com/300x200" },
    { nombre: "Remington 870", descripcion: "Escopeta de acción de bombeo", categoria: "escopeta", tipo: "manual", precio: "$700 USD", imagen: "https://via.placeholder.com/300x200" }
];

// Mostrar los productos
function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(arma => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${arma.imagen}" alt="${arma.nombre}">
            <h2>${arma.nombre}</h2>
            <p>${arma.descripcion}</p>
            <span>${arma.precio}</span>
            <button>Añadir al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

// Filtrar productos según búsqueda y selecciones
function filtrar() {
    const buscador = document.getElementById('buscador').value.toLowerCase();
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;

    const productosFiltrados = armas.filter(arma => {
        const matchesBusqueda = arma.nombre.toLowerCase().includes(buscador) || arma.descripcion.toLowerCase().includes(buscador);
        const matchesCategoria = categoria ? arma.categoria === categoria : true;
        const matchesTipo = tipo ? arma.tipo === tipo : true;
        return matchesBusqueda && matchesCategoria && matchesTipo;
    });

    mostrarProductos(productosFiltrados);
}

// Inicializar la vista con todos los productos
mostrarProductos(armas);
