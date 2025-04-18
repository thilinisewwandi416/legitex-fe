document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('otp-form');
    const cancelBtn = document.getElementById('cancel-btn');
  
    cancelBtn.addEventListener('click', function () {
      window.location.href = 'login.html';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const otp = document.getElementById('otp').value.trim();
  
      window.location.href = 'newpassword.html';
    });
  });
  