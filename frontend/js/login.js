document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'username' && password === 'password') {
        window.location.href = "adm.html";
    } else {
        document.getElementById('error-message').innerText = 'Nome de usuário ou senha incorretos.';
    }
});
