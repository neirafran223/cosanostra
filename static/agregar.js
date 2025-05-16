// Lista de armas almacenadas (simulando una base de datos en memoria)
let armas = [];

// Función para agregar arma
function agregarArma(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;
    const imagen = document.getElementById('imagen').value;

    // Crear un objeto arma
    const nuevaArma = {
        nombre: nombre,
        descripcion: descripcion,
        precio: `$${precio} USD`,
        categoria: categoria.toLowerCase(),
        tipo: tipo.toLowerCase(),
        imagen: imagen
    };

    // Agregar el arma a la lista de armas
    armas.push(nuevaArma);

    // Limpiar el formulario
    document.getElementById('form-agregar-arma').reset();

    // Mostrar la lista actualizada de armas en el catálogo
    alert('Arma agregada correctamente!');
    // Puedes redirigir al catálogo o actualizar el catálogo en la misma página.
    // window.location.href = "catalogo.html"; // Redirigir al catálogo
}

// Asignar el evento al formulario
document.getElementById('form-agregar-arma').addEventListener('submit', agregarArma);
