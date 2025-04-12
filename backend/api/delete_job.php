<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method allowed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["job_id"])) {
    echo json_encode(["error" => "Job ID is required"]);
    exit;
}

$jobId = $input["job_id"];

$database = new Database();
$conn = $database->getConnection();

$query = "DELETE FROM jobs WHERE id = :id";
$stmt = $conn->prepare($query);
$stmt->bindParam(":id", $jobId);

try {
    $stmt->execute();
    echo json_encode(["message" => "Job deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to delete job", "details" => $e->getMessage()]);
}
?>
