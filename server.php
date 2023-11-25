<?php
session_start();
    include ("index.html");
    

// SQLite database connection
$db = new SQLite3('database.db');

// Create users table if not exists
$query = "CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)";
$db->exec($query);

// Create messages table if not exists
$query = "CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)";
$db->exec($query);

// Handle registration
if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
    $stmt->bindParam(':username', $username, SQLITE3_TEXT);
    $stmt->bindParam(':password', $password, SQLITE3_TEXT);
    $stmt->execute();
}

// Handle login
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username, SQLITE3_TEXT);
    $result = $stmt->execute()->fetchArray();

    if ($result && password_verify($password, $result['password'])) {
        $_SESSION['username'] = $username;
    }
}

// Handle sending messages
if (isset($_POST['sendMessage'])) {
    $sender = $_SESSION['username'];
    $receiver = $_POST['receiver'];
    $content = $_POST['content'];

    $stmt = $db->prepare("INSERT INTO messages (sender, receiver, content) VALUES (:sender, :receiver, :content)");
    $stmt->bindParam(':sender', $sender, SQLITE3_TEXT);
    $stmt->bindParam(':receiver', $receiver, SQLITE3_TEXT);
    $stmt->bindParam(':content', $content, SQLITE3_TEXT);
    $stmt->execute();
}

// Handle retrieving messages
if (isset($_POST['getMessages'])) {
    $sender = $_SESSION['username'];
    $receiver = $_POST['receiver'];

    $stmt = $db->prepare("SELECT * FROM messages WHERE (sender = :sender AND receiver = :receiver) OR (sender = :receiver AND receiver = :sender) ORDER BY timestamp");
    $stmt->bindParam(':sender', $sender, SQLITE3_TEXT);
    $stmt->bindParam(':receiver', $receiver, SQLITE3_TEXT);
    $result = $stmt->execute();

    $messages = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $messages[] = $row;
    }

    echo json_encode($messages);
}
?>
