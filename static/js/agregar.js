// static/js/agregar-arma.js
document.addEventListener("DOMContentLoaded", function () {
  // Añadir estilos de notificación
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../static/css/notification.css';
  document.head.appendChild(style);

  // Verificar si es admin
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || currentUser.userType !== "admin") {
    showNotification("Acceso restringido a administradores", "error");
    setTimeout(() => window.location.href = "login.html", 2000);
    return;
  }

  const formAgregar = document.getElementById("form-agregar-arma");

  formAgregar.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar campos
    const nombre = document.getElementById("nombre").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (!nombre || !modelo || isNaN(precio) || isNaN(stock)) {
      showNotification("Complete todos los campos obligatorios", "error");
      return;
    }

    if (precio <= 0 || stock < 0) {
      showNotification("Precio y stock deben ser valores positivos", "error");
      return;
    }

    // Crear nueva arma
    const nuevaArma = {
      id: Date.now(),
      nombre,
      modelo,
      descripcion: document.getElementById("descripcion").value.trim(),
      precio,
      stock,
      categoria: document.getElementById("categoria").value,
      tipo: document.getElementById("tipo").value,
      imagen: document.getElementById("imagen").value || "https://via.placeholder.com/300x200"
    };

    // Guardar en localStorage
    let armas = JSON.parse(localStorage.getItem("armas")) || [];
    armas.push(nuevaArma);
    localStorage.setItem("armas", JSON.stringify(armas));

    showNotification(`Arma "${nombre}" agregada correctamente`, "success");

    // Limpiar formulario
    formAgregar.reset();

    // Opcional: redirigir al catálogo
    setTimeout(() => window.location.href = "catalogo.html", 1500);
  });
});