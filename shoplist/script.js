let list = [];

// -------------------------
// Local list handling
// -------------------------
function loadLocalList() {
  const saved = localStorage.getItem("shoppingList");
  if (saved) list = JSON.parse(saved);
}

function saveLocalList() {
  localStorage.setItem("shoppingList", JSON.stringify(list));
}

// -------------------------
// Dropdown logic
// -------------------------
function handleSelectChange() {
  const select = document.getElementById("itemSelect");
  const nameInput = document.getElementById("itemName");

  if (select.value === "new") {
    nameInput.style.display = "block";
  } else {
    nameInput.style.display = "none";
  }
}

// -------------------------
// Add item
// -------------------------
function addItem() {
  const select = document.getElementById("itemSelect");
  const nameInput = document.getElementById("itemName");
  const qty = parseInt(document.getElementById("itemQty").value);

  let name;

  if (select.value === "new") {
    name = nameInput.value.trim();
    if (!name) return;
  } else {
    name = select.value;
  }

  list.push({ name, qty, checked: false });
  saveLocalList();
  renderList();

  nameInput.value = "";
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
  const url = "https://raw.githubusercontent.com/MeX1Co/mex1co.github.io/master/shoplist/shopping_list.json";

  const response = await fetch(url);
  const json = await response.json();

  renderSeeList(json.items);
}

function renderSeeList(items) {
  const ul = document.getElementById("seeList");
  ul.innerHTML = "";

  items.forEach((item) => {
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
