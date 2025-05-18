document.addEventListener("DOMContentLoaded", function () {
  // Configuración de la base de datos
  const DB_NAME = "ArmasDB";
  const DB_VERSION = 1;
  let db;

  // Inicializar la base de datos
  const initDB = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Crear object store para usuarios si no existe
      if (!db.objectStoreNames.contains("users")) {
        const store = db.createObjectStore("users", {
          keyPath: "id",
        });

        // Crear índices
        store.createIndex("email", "email", { unique: true });
        store.createIndex("userType", "userType", { unique: false });
      }

      // Crear object store para armas si no existe
      if (!db.objectStoreNames.contains("weapons")) {
        const store = db.createObjectStore("weapons", {
          keyPath: "id",
        });

        // Crear índices
        store.createIndex("name", "name", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Error al abrir la base de datos:", event.target.error);
      reject(event.target.error);
    };
  });

  // Función para encriptar contraseñas (SHA-256)
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Función para validar email
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Función para registrar usuario
  async function registerUser(userData) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");

      // Verificar si el email ya existe
      const emailIndex = store.index("email");
      const emailRequest = emailIndex.get(userData.email);

      emailRequest.onsuccess = (e) => {
        if (e.target.result) {
          reject("Este correo electrónico ya está registrado.");
          return;
        }

        // Si no existe, guardar el nuevo usuario
        const addRequest = store.add(userData);

        addRequest.onsuccess = () => {
          resolve("¡Registro exitoso! Será redirigido al inicio de sesión.");
        };

        addRequest.onerror = (err) => {
          reject("Ocurrió un error al registrar el usuario.");
          console.error("Error al registrar usuario:", err);
        };
      };

      emailRequest.onerror = (err) => {
        reject("Ocurrió un error al verificar el email.");
        console.error("Error al verificar email:", err);
      };
    });
  }

  // Manejador del formulario de registro
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Obtener valores del formulario
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirm_password")
        .value.trim();
      const userType = document.getElementById("userType").value;
      const termsAccepted = document.getElementById("terms").checked;

      // Validaciones
      if (
        !nombre ||
        !apellido ||
        !email ||
        !password ||
        !confirmPassword ||
        !userType
      ) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Por favor ingrese un correo electrónico válido.");
        return;
      }

      if (password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      if (!termsAccepted) {
        alert("Debe aceptar los términos y condiciones.");
        return;
      }

      try {
        // Inicializar la base de datos
        await initDB;

        // Encriptar contraseña
        const hashedPassword = await hashPassword(password);

        // Crear objeto usuario
        const userData = {
          id: Date.now(),
          nombre,
          apellido,
          email,
          password: hashedPassword, // Guardamos la contraseña encriptada
          userType,
          fechaRegistro: new Date().toISOString(),
          activo: true,
        };

        // Registrar usuario
        const message = await registerUser(userData);
        alert(message);

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } catch (error) {
        alert(error);
        console.error("Error en el registro:", error);
      }
    });
  }

  // Función para agregar un arma (opcional, puedes moverla a otro archivo)
  async function addWeapon(weaponData) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("weapons", "readwrite");
      const store = transaction.objectStore("weapons");

      weaponData.id = Date.now();
      weaponData.fechaRegistro = new Date().toISOString();

      const request = store.add(weaponData);

      request.onsuccess = () => resolve();
      request.onerror = (err) => reject(err);
    });
  }
});
