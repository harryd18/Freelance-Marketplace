<?php

// header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Content-Type: application/json; charset=UTF-8");

// if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//     http_response_code(200);
//     exit;
// }

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once "../config/db.php";
require_once __DIR__ . "/cors.php";

$database = new Database();
$conn = $database->getConnection();
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// DEBUG LOGGING
$debugLog = fopen("debug_register.txt", "a");
fwrite($debugLog, "\n[Register] --- " . date("Y-m-d H:i:s") . " ---\n");

fwrite($debugLog, "DB Used: freelance_marketplace\n");

$input = file_get_contents("php://input");
fwrite($debugLog, "Raw Input: $input\n");

$data = json_decode($input, true);

if (!$data) {
    fwrite($debugLog, "JSON Decode Failed\n");
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

if (!isset($data["name"], $data["email"], $data["password"], $data["role"])) {
    fwrite($debugLog, "Missing field(s)\n");
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

$name = htmlspecialchars(strip_tags($data["name"]));
$email = htmlspecialchars(strip_tags($data["email"]));
$password = $data["password"];
$role = strtolower(htmlspecialchars(strip_tags($data["role"])));

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Save to DB
$query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
$stmt = $conn->prepare($query);

try {
    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":password" => $hashed_password,
        ":role" => $role
    ]);

    fwrite($debugLog, "User registered: $email\n");
    echo json_encode(["message" => "User registered successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    fwrite($debugLog, "Registration error: " . $e->getMessage() . "\n");
    echo json_encode([
        "error" => "Failed to register user",
        "details" => $e->getMessage()
    ]);
}

fclose($debugLog);
?>
