<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once "../config/db.php";

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

$input = file_get_contents("php://input");
file_put_contents("debug.log", print_r($input, true)); 
$data = json_decode($input, true);

if (!$data || !isset($data["name"]) || !isset($data["email"]) || !isset($data["password"]) || !isset($data["role"])) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

$name = htmlspecialchars(strip_tags($data["name"]));
$email = htmlspecialchars(strip_tags($data["email"]));
$password = $data["password"]; 
$role = htmlspecialchars(strip_tags($data["role"]));

// Hash the password before storing
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert into DB
$query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
$stmt = $conn->prepare($query);

try {
    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":password" => $hashed_password,
        ":role" => $role
    ]);

    echo json_encode(["message" => "User registered successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Email already exists or query failed", "details" => $e->getMessage()]);
}
?>
