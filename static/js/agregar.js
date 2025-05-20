document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario es admin
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
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

    // Obtener armas existentes
    let armas = JSON.parse(localStorage.getItem("armas")) || [];

    // Agregar nueva arma
    armas.push(nuevaArma);

    // Guardar en localStorage
    localStorage.setItem("armas", JSON.stringify(armas));

    // Guardar en IndexedDB
    saveWeaponToIndexedDB(nuevaArma)
      .then(() => {
        alert(`¡Arma "${nombre}" agregada correctamente al catálogo!`);
        window.location.href = "catalogo.html";
      })
      .catch(error => {
        console.error("Error al guardar en IndexedDB:", error);
        alert("Ocurrió un error al guardar el arma.");
      });
  });

  // Función para guardar en IndexedDB
  function saveWeaponToIndexedDB(weaponData) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ArmasDB", 1);

      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("weapons", "readwrite");
        const store = tx.objectStore("weapons");

        const req = store.add(weaponData);
        
        req.onsuccess = () => resolve();
        req.onerror = (err) => reject(err);
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  }

  // Validación de imagen URL
  document.getElementById("imagen").addEventListener("change", function () {
    const url = this.value.trim();
    if (url && !url.match(/\.(jpeg|jpg|png|gif)$/i)) {
      alert("Por favor ingrese una URL de imagen válida (JPEG, JPG, PNG o GIF).");
      this.value = "";
    }
  });
});