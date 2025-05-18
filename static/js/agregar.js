document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario es admin
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.userType !== "admin") {
    alert("Acceso restringido a administradores");
    window.location.href = "catalogo.html";
    return;
  }

  const formAgregar = document.getElementById("form-agregar-arma");

  formAgregar.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoria = document.getElementById("categoria").value;
    const tipo = document.getElementById("tipo").value;
    const imagen = document.getElementById("imagen").value.trim();

    // Validaciones
    if (
      !nombre ||
      !modelo ||
      !descripcion ||
      isNaN(precio) ||
      isNaN(stock) ||
      !categoria ||
      !tipo
    ) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    if (precio <= 0 || stock < 0) {
      alert("Precio y stock deben ser valores positivos.");
      return;
    }

    // Crear nuevo objeto arma
    const nuevaArma = {
      id: Date.now(),
      nombre,
      modelo,
      descripcion,
      precio,
      stock,
      categoria,
      tipo,
      imagen: imagen || "https://via.placeholder.com/300x200",
    };

    // Obtener armas existentes o inicializar array
    let armas = JSON.parse(localStorage.getItem("armas")) || [];

    // Agregar nueva arma
    armas.push(nuevaArma);

    // Guardar en localStorage
    localStorage.setItem("armas", JSON.stringify(armas));

    // Mostrar confirmación
    alert(`¡Arma "${nombre}" agregada correctamente al catálogo!`);

    // Redirigir al catálogo
    window.location.href = "catalogo.html";
  });

  // Validación de imagen URL (opcional)
  document.getElementById("imagen").addEventListener("change", function () {
    const url = this.value.trim();
    if (url && !url.match(/\.(jpeg|jpg|png|gif)$/i)) {
      alert(
        "Por favor ingrese una URL de imagen válida (JPEG, JPG, PNG o GIF)."
      );
      this.value = "";
    }
  });
});
