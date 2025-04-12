<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/db.php";

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$headers = getallheaders();
$authHeader = $headers["Authorization"] ?? '';

if (!$authHeader || !str_starts_with($authHeader, "Bearer ")) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied - no token"]);
    exit;
}

$token = trim(str_replace("Bearer", "", $authHeader));

$database = new Database();
$conn = $database->getConnection();

// Mock user auth by checking token suffix matches user id
$user = null;
$query = "SELECT id, role FROM users";
$stmt = $conn->prepare($query);
$stmt->execute();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if (str_ends_with($token, $row["id"]) && $row["role"] === "freelancer") {
        $user = $row;
        break;
    }
}

if (!$user) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied"]);
    exit;
}

// Parse input
$data = json_decode(file_get_contents("php://input"), true);
$jobId = $data["job_id"] ?? null;
$amount = $data["amount"] ?? null;

if (!$jobId || !$amount) {
    http_response_code(400);
    echo json_encode(["error" => "Missing job_id or amount"]);
    exit;
}

// Check if user already placed a bid on this job
$check = $conn->prepare("SELECT id FROM bids WHERE freelancer_id = ? AND job_id = ?");
$check->execute([$user["id"], $jobId]);

if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "You have already placed a bid on this job."]);
    exit;
}

// Insert bid
$insert = $conn->prepare("INSERT INTO bids (freelancer_id, job_id, amount) VALUES (?, ?, ?)");
$success = $insert->execute([$user["id"], $jobId, $amount]);

if ($success) {
    echo json_encode(["message" => "Bid submitted successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to submit bid."]);
}
?>
