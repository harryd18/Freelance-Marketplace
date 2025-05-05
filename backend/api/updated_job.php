<?php
// header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Content-Type: application/json; charset=UTF-8");

// if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//     http_response_code(200);
//     exit;
// }

include_once "../config/db.php";
require_once __DIR__ . "/cors.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["job_id"], $input["title"], $input["description"], $input["budget"])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$jobId = $input["job_id"];
$title = $input["title"];
$description = $input["description"];
$budget = $input["budget"];

$database = new Database();
$conn = $database->getConnection();

$query = "UPDATE jobs SET title = :title, description = :description, budget = :budget WHERE id = :id";
$stmt = $conn->prepare($query);
$stmt->bindParam(":id", $jobId);
$stmt->bindParam(":title", $title);
$stmt->bindParam(":description", $description);
$stmt->bindParam(":budget", $budget);

try {
    $stmt->execute();
    echo json_encode(["message" => "Job updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to update job", "details" => $e->getMessage()]);
}
?>
