document.addEventListener("DOMContentLoaded", async function () {
  // Verificar si el usuario es admin
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || currentUser.userType !== "admin") {
    window.location.href = "login.html";
    return;
  }

  // Mostrar usuarios
  const users = await getAllUsers();
  displayUsers(users);

  // Mostrar armas
  const weapons = await getAllWeapons();
  displayWeapons(weapons);

  async function getAllUsers() {
    return new Promise((resolve) => {
      const request = indexedDB.open("ArmasDB", 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
      };
    });
  }

  async function getAllWeapons() {
    return new Promise((resolve) => {
      const request = indexedDB.open("ArmasDB", 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("weapons", "readonly");
        const store = tx.objectStore("weapons");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
      };
    });
  }

  function displayUsers(users) {
    const table = document.getElementById("usersTable");
    if (!users.length) {
      table.innerHTML = "<tr><td colspan='6'>No hay usuarios registrados</td></tr>";
      return;
    }

    let html = `
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Tipo</th>
        <th>Fecha Registro</th>
        <th>Acciones</th>
      </tr>
    `;

    users.forEach(user => {
      html += `
        <tr>
          <td>${user.id}</td>
          <td>${user.nombre} ${user.apellido || ''}</td>
          <td>${user.email}</td>
          <td>${user.userType}</td>
          <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
          <td>
            <button class="btn-edit" data-id="${user.id}">Editar</button>
            <button class="btn-delete" data-id="${user.id}">Eliminar</button>
          </td>
        </tr>
      `;
    });

    table.innerHTML = html;
  }

  function displayWeapons(weapons) {
    const table = document.getElementById("weaponsTable");
    if (!weapons.length) {
      table.innerHTML = "<tr><td colspan='8'>No hay armas registradas</td></tr>";
      return;
    }

    let html = `
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Modelo</th>
        <th>Categoría</th>
        <th>Tipo</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Acciones</th>
      </tr>
    `;

    weapons.forEach(weapon => {
      html += `
        <tr>
          <td>${weapon.id}</td>
          <td>${weapon.nombre}</td>
          <td>${weapon.modelo}</td>
          <td>${weapon.categoria}</td>
          <td>${weapon.tipo}</td>
          <td>$${weapon.precio.toFixed(2)}</td>
          <td>${weapon.stock}</td>
          <td>
            <button class="btn-edit" data-id="${weapon.id}">Editar</button>
            <button class="btn-delete" data-id="${weapon.id}">Eliminar</button>
          </td>
        </tr>
      `;
    });

    table.innerHTML = html;
  }
});