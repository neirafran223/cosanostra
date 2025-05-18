// Verificar si el usuario está autenticado
function isAuthenticated() {
  return !!localStorage.getItem("currentUser");
}

// Verificar si el usuario es administrador
function isAdmin() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user && user.role === "admin";
}

// Proteger rutas de admin
function protectAdminRoute() {
  if (!isAuthenticated()) {
    window.location.href = "../login.html";
    return false;
  }

  if (!isAdmin()) {
    window.location.href = "../index.html";
    return false;
  }

  return true;
}

// Proteger rutas de cliente
function protectClientRoute() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return false;
  }

  return true;
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

export {
  isAuthenticated,
  isAdmin,
  protectAdminRoute,
  protectClientRoute,
  logout,
};
