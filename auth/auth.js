document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[email] && users[email].password === password) {
    localStorage.setItem("loggedInUser", email);
    window.location.href = "../popup/popup.html";
  } else {
    alert("Invalid email or password.");
  }
});

document.getElementById("signup-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[email]) {
    alert("User already exists!");
    return;
  }
  users[email] = { password };
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "login.html";
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../auth/login.html";
});

// Sign-Up Form Handler
document.getElementById("signup-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email]) {
      alert("An account with this email already exists!");
      return;
    }
  
    // Save user to localStorage
    users[email] = { password };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account successfully created!");
    
    // Redirect to login page after signup
    window.location.href = "login.html";
  });
  
