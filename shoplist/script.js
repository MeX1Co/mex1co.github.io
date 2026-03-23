// -------------------------
// Local list handling
// -------------------------
let list = [];

function loadLocalList() {
  const saved = localStorage.getItem("shoppingList");
  if (saved) list = JSON.parse(saved);
}

function saveLocalList() {
  localStorage.setItem("shoppingList", JSON.stringify(list));
}

// -------------------------
// Add item (Make List)
// -------------------------
function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const qty = parseInt(document.getElementById("itemQty").value);

  if (!name) return;

  list.push({ name, qty, checked: false });
  saveLocalList();
  renderList();

  document.getElementById("itemName").value = "";
  document.getElementById("itemQty").value = 1;
}

// -------------------------
// Render list (Make List)
// -------------------------
function renderList() {
  const ul = document.getElementById("itemList");
  if (!ul) return;

  ul.innerHTML = "";

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} (x${item.qty})
      <button onclick="removeItem(${index})">X</button>
    `;
    ul.appendChild(li);
  });
}

function removeItem(index) {
  list.splice(index, 1);
  saveLocalList();
  renderList();
}

// -------------------------
// Export JSON
// -------------------------
function downloadJSON() {
  const data = JSON.stringify({ items: list }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "shopping_list.json";
  a.click();
}

// -------------------------
// Load from GitHub (See List)
// -------------------------
async function loadFromGitHub() {
  const url = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/shopping_list.json";

  const response = await fetch(url);
  const json = await response.json();

  renderSeeList(json.items);
}

function renderSeeList(items) {
  const ul = document.getElementById("seeList");
  ul.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.checked ? "checked" : "";

    li.innerHTML = `
      ${item.name} (x${item.qty})
      <button onclick="toggleCheck(this)">✔</button>
    `;

    ul.appendChild(li);
  });
}

function toggleCheck(button) {
  const li = button.parentElement;
  li.classList.toggle("checked");
}
