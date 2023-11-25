document.addEventListener("DOMContentLoaded", function() {
    checkSession();
});

function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'register': true,
            'username': username,
            'password': password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Registration successful!');
        showLogin();
    })
    .catch(error => console.error('Error:', error));
}

function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'login': true,
            'username': username,
            'password': password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            showMessaging();
            document.getElementById("loggedInUser").innerText = data.username;
            loadMessages();
        } else {
            alert('Login failed. Check your credentials.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function sendMessage() {
    let receiver = document.getElementById("loggedInUser").innerText;
    let content = document.getElementById("messageInput").value;

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'sendMessage': true,
            'receiver': receiver,
            'content': content,
        }),
    })
    .then(response => response.json())
    .then(data => {
        loadMessages();
        document.getElementById("messageInput").value = '';
    })
    .catch(error => console.error('Error:', error));
}

function loadMessages() {
    let receiver = document.getElementById("loggedInUser").innerText;

    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'getMessages': true,
            'receiver': receiver,
        }),
    })
    .then(response => response.json())
    .then(messages => {
        let messageList = document.getElementById("messageList");
        messageList.innerHTML = '';

        messages.forEach(message => {
            let div = document.createElement("div");
            div.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
            messageList.appendChild(div);
        });

        // Scroll to the bottom of the message list
        messageList.scrollTop = messageList.scrollHeight;
    })
    .catch(error => console.error('Error:', error));
}

function showLogin() {
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function showMessaging() {
    document.getElementById("login").style.display = "none";
    document.getElementById("messaging").style.display = "block";
}

function checkSession() {
    fetch('server.php')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            showMessaging();
            document.getElementById("loggedInUser").innerText = data.username;
            loadMessages();
        } else {
            showLogin();
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout() {
    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'logout': true,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showLogin();
    })
    .catch(error => console.error('Error:', error));
}
