function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('reset-password-form');

  cancelBtn.addEventListener('click', function () {
    window.location.href = 'login.html';
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!email) {
      showToast("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/reset-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok && result.message === "OTP sent to your email") {
        const emailData = {
          email: email,
          savedAt: new Date().getTime() 
        };
        localStorage.setItem("resetEmailData", JSON.stringify(emailData));

        window.location.href = "otp.html";
      } else {
        showToast("Failed to send OTP: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      showToast("Something went wrong. Please try again later.");
    }
  });
});