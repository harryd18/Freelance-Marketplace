<?php
// header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Content-Type: application/json; charset=UTF-8");

include_once "../config/db.php";
require_once __DIR__ . "/cors.php";

// if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//     http_response_code(200);
//     exit;
// }

// Step 1: Get token and extract user ID
$headers = getallheaders();
$authHeader = $headers["Authorization"] ?? '';

if (!$authHeader || !str_starts_with($authHeader, "Bearer ")) {
    http_response_code(403);
    echo json_encode(["error" => "Missing or invalid token"]);
    exit;
}

$token = trim(str_replace("Bearer", "", $authHeader));
$parts = explode(":", $token);
$clientId = end($parts);  // This is for user/client ID

// Step 2: Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);
$title = $input["title"] ?? '';
$description = $input["description"] ?? '';
$budget = $input["budget"] ?? '';

// Step 3: Validation
if (empty($title) || empty($description) || empty($budget)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Step 4: Insert into DB
$database = new Database();
$conn = $database->getConnection();

$sql = "INSERT INTO jobs (title, description, budget, client_id) VALUES (:title, :description, :budget, :client_id)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":title", $title);
$stmt->bindParam(":description", $description);
$stmt->bindParam(":budget", $budget);
$stmt->bindParam(":client_id", $clientId);

try {
    $stmt->execute();
    echo json_encode(["message" => "Job posted successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to post job", "details" => $e->getMessage()]);
}
?>
