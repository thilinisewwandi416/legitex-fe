function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('new-password-form');
    const cancelBtn = document.getElementById('cancel-btn');
  
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const newPassword = document.getElementById('npw').value.trim();
      const confirmPassword = document.getElementById('cpw').value.trim();
      const storedData = JSON.parse(localStorage.getItem('resetEmailData'));
      const email = storedData?.email;
  
      if (!email) {
        showToast("Session expired. Please request a new OTP.");
        window.location.href = 'reset-password.html';
        return;
      }
  
      if (!newPassword || !confirmPassword) {
        showToast("Both fields are required.");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match.");
        return;
      }
  
      try {
        const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/reset-password/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            new_password: newPassword
          })
        });
  
        const result = await response.json();
  
        if (response.ok && result.message) {
            showToast("Password updated successfully. Redirecting to login...");
          localStorage.removeItem('resetEmailData');
          window.location.href = 'login.html';
        } else {
            showToast(result.message || "Something went wrong while updating the password.");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        showToast("Failed to update password. Try again later.");
      }
    });
  });
  