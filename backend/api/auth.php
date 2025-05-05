<?php
// header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/cors.php";  
require_once __DIR__ . "/../config/db.php";

// if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//     http_response_code(200);
//     exit;
// }

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST requests allowed"]);
    exit;
}

// Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);
$email = $input["email"] ?? '';
$password = $input["password"] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing email or password"]);
    exit;
}

// Connect to DB
$database = new Database();
$conn = $database->getConnection();

// Look up user
$query = "SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bindParam(":email", $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "User not found"]);
    exit;
}

if (!password_verify($password, $user["password"])) {
    http_response_code(401);
    echo json_encode(["error" => "Incorrect password"]);
    exit;
}

// Generate token
$token = bin2hex(random_bytes(16)) . ":" . $user["id"];

// Always clean output buffer just in case
if (ob_get_length()) {
    ob_clean();
}

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
exit;
