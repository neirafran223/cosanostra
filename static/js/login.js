document.addEventListener("DOMContentLoaded", async function () {
  // Configuración de la base de datos
  const DB_NAME = "ArmasDB";
  const DB_VERSION = 1;
  let db;

  try {
    // Abrir la base de datos
    db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => {
        console.error("Error al abrir la base de datos:", event.target.error);
        reject(event.target.error);
      };
    });

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const userType = document.getElementById("userType").value;

      // Validaciones básicas
      if (!email || !password || !userType) {
        alert("Por favor complete todos los campos.");
        return;
      }

      try {
        // Obtener usuario de IndexedDB
        const user = await new Promise((resolve, reject) => {
          const transaction = db.transaction("users", "readonly");
          const store = transaction.objectStore("users");
          const index = store.index("email");
          const request = index.get(email);

          request.onsuccess = (e) => resolve(e.target.result);
          request.onerror = (e) => reject(e.target.error);
        });

        if (!user) {
          alert("No existe un usuario con este correo.");
          return;
        }

        // Verificar contraseña (comparar hashes)
        const hashedPassword = await hashPassword(password);
        if (user.password !== hashedPassword) {
          alert("Contraseña incorrecta.");
          return;
        }

        // Verificar tipo de usuario
        if (user.userType !== userType) {
          alert("No tiene permisos para acceder como este tipo de usuario.");
          return;
        }

        // Verificar si la cuenta está activa
        if (user.activo === false) {
          alert("Esta cuenta está desactivada. Contacte al administrador.");
          return;
        }

        // Guardar usuario actual en sesión
        sessionStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          userType: user.userType
        }));

        // Redirigir según el tipo de usuario
        const redirectPage = userType === "admin" ? "agregar-arma.html" : "catalogo.html";
        window.location.href = redirectPage;

      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        alert("Ocurrió un error al iniciar sesión. Intente nuevamente.");
      }
    });

    // Función para encriptar contraseñas (SHA-256)
    async function hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    alert("Error al cargar la aplicación. Recargue la página.");
  }
});