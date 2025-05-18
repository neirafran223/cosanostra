// admin.js
document.addEventListener("DOMContentLoaded", async function () {
  // Verificar si el usuario es admin
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || currentUser.userType !== "admin") {
    window.location.href = "login.html";
    return;
  }

  // Mostrar usuarios
  const users = await getAllUsers();
  displayData("usersTable", users);

  // Mostrar armas
  const weapons = await getAllWeapons();
  displayData("weaponsTable", weapons);

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

  function displayData(tableId, data) {
    const table = document.getElementById(tableId);
    if (!data.length) {
      table.innerHTML = "<tr><td>No hay datos</td></tr>";
      return;
    }

    const headers = Object.keys(data[0]);
    let html = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;

    data;
  }
});
