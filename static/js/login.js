// static/js/login.js
document.addEventListener("DOMContentLoaded", async function () {
  // Asegúrate de incluir el CSS de notificaciones
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../static/css/notification.css';
  document.head.appendChild(style);

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;

    if (!email || !password || !userType) {
      showNotification("Por favor complete todos los campos", "error");
      return;
    }

    try {
      // Obtener usuarios registrados
      const users = JSON.parse(localStorage.getItem("users")) || [];
      
      // Buscar usuario por email y tipo
      const user = users.find(u => 
        u.email === email && 
        u.userType === userType &&
        u.activo !== false
      );

      if (!user) {
        showNotification("Credenciales incorrectas o usuario no existe", "error");
        return;
      }

      // Verificar contraseña (comparar hashes)
      const hashedPassword = await hashPassword(password);
      if (user.password !== hashedPassword) {
        showNotification("Credenciales incorrectas", "error");
        return;
      }

      // Guardar usuario en sesión (sin la contraseña)
      sessionStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        userType: user.userType
      }));

      showNotification(`Bienvenido ${user.nombre}`, "success");

      // Redirigir según el tipo de usuario
      setTimeout(() => {
        const redirectPage = userType === "admin" ? "agregar-arma.html" : "catalogo.html";
        window.location.href = redirectPage;
      }, 1500);

    } catch (error) {
      console.error("Error en el login:", error);
      showNotification("Ocurrió un error al iniciar sesión", "error");
    }
  });

  // Función para hashear contraseña (debe ser idéntica a la de registro)
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});