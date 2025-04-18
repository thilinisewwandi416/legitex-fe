document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancel-btn').addEventListener('click', function () {
      window.location.href = 'login.html';
    });

    document.getElementById('reset-password-form').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      localStorage.setItem('resetEmail', email);

      window.location.href = 'otp.html';
    });
  });
  