function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('otp-form');
  const cancelBtn = document.getElementById('cancel-btn');

  cancelBtn.addEventListener('click', function () {
    window.location.href = 'login.html';
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const otp = document.getElementById('otp').value.trim();
    const email = localStorage.getItem('resetEmail'); 

    if (!email || !otp) {
      showToast("Missing email or OTP.");
      return;
    }

    try {
      const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/reset-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const result = await response.json();

      if (response.ok && result.message) {
        localStorage.setItem("otpVerified", "true");

        window.location.href = "newpassword.html";
      } else {
        showToast(result.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showToast("Failed to verify OTP. Please try again later.");
    }
  });
});