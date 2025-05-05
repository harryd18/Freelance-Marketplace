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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method allowed"]);
    exit;
}

$headers = getallheaders();
$authHeader = $headers["Authorization"] ?? '';

if (!$authHeader || !str_starts_with($authHeader, "Bearer ")) {
    http_response_code(403);
    echo json_encode(["error" => "No valid token"]);
    exit;
}

$token = trim(str_replace("Bearer", "", $authHeader));
$parts = explode(':', $token);
$userIdFromToken = end($parts);

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["job_id"])) {
    echo json_encode(["error" => "Job ID is required"]);
    exit;
}

$jobId = $input["job_id"];

$database = new Database();
$conn = $database->getConnection();

// Check if the job belongs to the client
$checkQuery = "SELECT * FROM jobs WHERE id = :id AND client_id = :clientId";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->execute([
    ":id" => $jobId,
    ":clientId" => $userIdFromToken
]);

if ($checkStmt->rowCount() === 0) {
    http_response_code(403);
    echo json_encode(["error" => "Not authorized to delete this job"]);
    exit;
}

// Delete the job
$deleteQuery = "DELETE FROM jobs WHERE id = :id";
$deleteStmt = $conn->prepare($deleteQuery);
$deleteStmt->bindParam(":id", $jobId);

try {
    $deleteStmt->execute();
    echo json_encode(["message" => "Job deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to delete job", "details" => $e->getMessage()]);
}
?>
