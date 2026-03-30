const BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

let user = JSON.parse(atob(token.split(".")[1]));

// 👑 PREMIUM CHECK
const downloadBtn = document.getElementById("downloadBtn");
const premiumMsg = document.getElementById("premiumMsg");

if (user.isPremium) {
  premiumMsg.innerText = "👑 Premium User";
  downloadBtn.disabled = false;
} else {
  premiumMsg.innerText = "Upgrade to Premium to download reports 🚀";
  downloadBtn.disabled = true;
}

// 📊 LOAD DATA
let allExpenses = [];

async function loadData() {
  const res = await fetch(`${BASE_URL}/expense/get?page=1&limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  allExpenses = data.expenses;

  render(allExpenses);
}

function render(data) {
  const table = document.getElementById("reportTable");
  table.innerHTML = "";

  data.forEach((e) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${new Date(e.createdAt).toLocaleDateString()}</td>
      <td>${e.description}</td>
      <td>${e.category}</td>
      <td>₹${e.amount}</td>
    `;

    table.appendChild(tr);
  });
}

// 📅 FILTER
function filterData(type) {
  let now = new Date();

  let filtered = allExpenses.filter((e) => {
    let d = new Date(e.createdAt);

    if (type === "daily") {
      return d.toDateString() === now.toDateString();
    }

    if (type === "weekly") {
      let diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (type === "monthly") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
  });

  render(filtered);
}

// 📥 DOWNLOAD
downloadBtn.onclick = () => {
  if (!user.isPremium) return;

  let content = "Date,Description,Category,Amount\n";

  allExpenses.forEach((e) => {
    content += `${new Date(e.createdAt).toLocaleDateString()},${e.description},${e.category},${e.amount}\n`;
  });

  const blob = new Blob([content], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
};

// 🚀 INIT
loadData();