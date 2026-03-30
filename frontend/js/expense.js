const BASE_URL = "http://localhost:3000";

// 🔐 CHECK LOGIN
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

let token = localStorage.getItem("token");

// 🧠 DECODE USER
let user = JSON.parse(atob(token.split(".")[1]));
console.log("Decoded user:", user);

// 🎯 UI ELEMENTS
const premiumMsg = document.getElementById("premium");
const buyBtn = document.getElementById("buyPremium");

// ⭐ PREMIUM UI CONTROL
function updatePremiumUI(user) {
  if (user && user.isPremium) {
    premiumMsg.innerText = "You are a Premium User";
    buyBtn.style.display = "none";
  } else {
    premiumMsg.innerText = "Upgrade to Premium ";
    buyBtn.style.display = "block";
  }
}

updatePremiumUI(user);

// 💳 BUY PREMIUM
buyBtn.onclick = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/purchase/premium`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { orderId } = res.data;

    // simulate payment
    const paymentSuccess = true;

    if (paymentSuccess) {
      const res2 = await axios.post(
        `${BASE_URL}/purchase/update-status`,
        { orderId, status: "SUCCESS" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ UPDATE TOKEN
      localStorage.setItem("token", res2.data.token);

      // 🔥 UPDATE UI WITHOUT RELOAD
      let newUser = JSON.parse(atob(res2.data.token.split(".")[1]));
      updatePremiumUI(newUser);

      alert("🎉 Premium Activated!");
    }
  } catch (err) {
    console.log(err);
  }
};

// ➕ ADD EXPENSE
document
  .getElementById("expense-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(`${BASE_URL}/expense/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: amount.value,
        description: description.value,
        category: category.value,
      }),
    });

    loadExpenses();
  });

// 📊 LOAD EXPENSES
async function loadExpenses(page = 1) {
  const res = await fetch(
    `${BASE_URL}/expense/get?page=${page}&limit=10`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  render(data.expenses || []);
}

// 🖼️ RENDER EXPENSES
function render(expenses) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  expenses.forEach((e) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>₹${e.amount} - ${e.description} (${e.category})</span>
      <button onclick="deleteExpense(${e.id})">Delete</button>
    `;

    list.appendChild(li);
  });
}

// ❌ DELETE
window.deleteExpense = async function (id) {
  await fetch(`${BASE_URL}/expense/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  loadExpenses();
};

// 🏆 LEADERBOARD
async function showLeaderboard() {
  const res = await fetch(`${BASE_URL}/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 403) {
    alert("Only premium users 🚫");
    return;
  }

  const data = await res.json();

  const top3Div = document.getElementById("top3");
  const ul = document.getElementById("leaderboard");

  top3Div.innerHTML = "";
  ul.innerHTML = "";

  // 🥇 TOP 3
  const medals = ["🥇", "🥈", "🥉"];

  data.slice(0, 3).forEach((u, i) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${medals[i]} ${u.name}</strong> - ₹${u.totalExpense}
    `;

    div.style.marginBottom = "8px";
    div.style.fontSize = "16px";

    top3Div.appendChild(div);
  });

  // 📊 REST
  data.slice(3).forEach((u, i) => {
    const li = document.createElement("li");

    li.innerText = `#${i + 4} ${u.name} - ₹${u.totalExpense}`;

    ul.appendChild(li);
  });
}

async function loadInsights() {
  const res = await fetch(`${BASE_URL}/expense/insights`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  document.getElementById("insight").innerText =
    data.insight || data.message;
}
const reportBtn = document.getElementById("reportBtn");

// 👑 PREMIUM CONTROL
if (user && user.isPremium) {
  reportBtn.style.display = "inline-block";
} else {
  reportBtn.style.display = "none";
}

// 🔗 NAVIGATION
function goReport() {
  window.location.href = "report.html";
}
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");

let timeout;

// 🔥 DEBOUNCE (IMPORTANT)
descriptionInput.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const text = descriptionInput.value;

    if (!text) {
      categoryInput.value = "";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/expense/categorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: text }),
      });

      const data = await res.json();

      categoryInput.value = data.category;
    } catch (err) {
      categoryInput.value = "Other 💸";
    }
  }, 400); // 🔥 delay for smooth UX
});
// 🚀 INIT
loadExpenses();
loadInsights(); 