<?php

require_once __DIR__ . "/cors.php";
require_once __DIR__ . "/../config/db.php";


$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input["email"] ?? '');
$password = trim($input["password"] ?? '');

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing email or password"]);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();

    $query = "SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
        exit;
    }

    $token = bin2hex(random_bytes(16)) . ":" . $user["id"];

    echo json_encode([
        "message" => "Login successful",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ],
        "token" => $token
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
}
?>
