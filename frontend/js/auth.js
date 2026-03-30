// INPUTS
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// SIGNUP
const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    alert("Signup successful");
    window.location = "login.html";
  });
}

// LOGIN
const BASE_URL = "http://localhost:3000";

// 🔑 LOGIN
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // 🔥 DEBUG
      const user = JSON.parse(atob(data.token.split(".")[1]));
      console.log("Login user:", user);

      window.location.href = "expense.html";
    } else {
      alert(data.message);
    }
  });
}