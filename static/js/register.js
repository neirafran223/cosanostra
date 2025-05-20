// static/js/register.js
document.addEventListener("DOMContentLoaded", function () {
  // Añadir estilos de notificación
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../static/css/notification.css';
  document.head.appendChild(style);

  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const userType = document.getElementById("userType").value;
    const termsAccepted = document.getElementById("terms").checked;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password || !confirmPassword || !userType) {
      showNotification("Por favor complete todos los campos", "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }

    if (password.length < 8) {
      showNotification("La contraseña debe tener al menos 8 caracteres", "error");
      return;
    }

    if (!termsAccepted) {
      showNotification("Debe aceptar los términos y condiciones", "error");
      return;
    }

    try {
      // Verificar si el email ya está registrado
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = users.some(user => user.email === email);
      
      if (emailExists) {
        showNotification("Este correo electrónico ya está registrado", "error");
        return;
      }

      // Hashear la contraseña (simulación - en producción usaría bcrypt)
      const hashedPassword = await hashPassword(password);

      // Crear objeto usuario
      const userData = {
        id: Date.now(),
        nombre,
        apellido,
        email,
        password: hashedPassword,
        userType,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      // Guardar usuario
      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));

      showNotification("Registro exitoso! Redirigiendo...", "success");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);

    } catch (error) {
      console.error("Error en el registro:", error);
      showNotification("Ocurrió un error al registrar el usuario", "error");
    }
  });

  // Función para hashear contraseña (simplificada para el ejemplo)
  async function hashPassword(password) {
    // En un caso real usarías algo como bcrypt
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});