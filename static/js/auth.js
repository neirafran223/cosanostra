// Verificar si el usuario está autenticado
function isAuthenticated() {
  return !!sessionStorage.getItem("currentUser");
}

// Verificar si el usuario es administrador
function isAdmin() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  return user && user.userType === "admin";
}

// Proteger rutas de admin
function protectAdminRoute() {
  if (!isAuthenticated()) {
    sessionStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "login.html";
    return false;
  }

  if (!isAdmin()) {
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// Proteger rutas de cliente
function protectClientRoute() {
  if (!isAuthenticated()) {
    sessionStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Cerrar sesión
function logout() {
  sessionStorage.removeItem("currentUser");
  localStorage.removeItem("carrito");
  window.location.href = "index.html";
}

export {
  isAuthenticated,
  isAdmin,
  protectAdminRoute,
  protectClientRoute,
  logout
};