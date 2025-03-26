function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      chrome.storage.local.set({ authToken: data.token }, () => {
        showToast("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "../popup/popup.html";
        }, 1500);
      });
    } else {
      const error = await response.json();
      showToast(error.message || "Invalid email or password.");
    }
  } catch (error) {
    showToast("An error occurred while logging in.");
  }
});

document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      showToast("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      const error = await response.json();
      showToast(error.message || "Registration failed.");
    }
  } catch (error) {
    showToast("An error occurred during registration.");
  }
});

