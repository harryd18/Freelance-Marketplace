<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$headers = getallheaders();
$authHeader = $headers["Authorization"] ?? '';

if (!$authHeader || !str_starts_with($authHeader, "Bearer ")) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied - no valid token"]);
    exit;
}

$token = trim(str_replace("Bearer", "", $authHeader));
$parts = explode(':', $token);
$userIdFromToken = end($parts);

$database = new Database();
$conn = $database->getConnection();

// Get user details
$query = "SELECT id, name, email, role FROM users WHERE id = :id";
$stmt = $conn->prepare($query);
$stmt->bindParam(":id", $userIdFromToken);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied – user not found"]);
    exit;
}

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Handle posting a new job (client only)
    if ($user["role"] !== "client") {
        http_response_code(403);
        echo json_encode(["error" => "Only clients can post jobs"]);
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["title"], $input["description"], $input["budget"])) {
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    $title = htmlspecialchars(strip_tags($input["title"]));
    $description = htmlspecialchars(strip_tags($input["description"]));
    $budget = floatval($input["budget"]);

    $insertQuery = "INSERT INTO jobs (client_id, title, description, budget, created_at) 
                    VALUES (:client_id, :title, :description, :budget, NOW())";

    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->execute([
        ":client_id" => $user["id"],
        ":title" => $title,
        ":description" => $description,
        ":budget" => $budget
    ]);

    echo json_encode(["message" => "Job posted successfully"]);
    exit;
}

// Default GET logic (fetching jobs)
if ($user["role"] === "client") {
    $jobQuery = "SELECT id, title, description, budget FROM jobs WHERE client_id = :clientId ORDER BY created_at DESC";
    $jobStmt = $conn->prepare($jobQuery);
    $jobStmt->bindParam(":clientId", $user["id"]);
    $jobStmt->execute();
    $jobs = $jobStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($jobs as &$job) {
        $bidQuery = "SELECT b.amount, u.name AS freelancer_name
                     FROM bids b
                     JOIN users u ON b.freelancer_id = u.id
                     WHERE b.job_id = :jobId";
        $bidStmt = $conn->prepare($bidQuery);
        $bidStmt->bindParam(":jobId", $job['id']);
        $bidStmt->execute();
        $job['bids'] = $bidStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    $data["userProjects"] = $jobs;
} elseif ($user["role"] === "freelancer") {
    $jobQuery = "SELECT id, title, description, budget FROM jobs ORDER BY created_at DESC";
    $jobStmt = $conn->prepare($jobQuery);
    $jobStmt->execute();
    $data["jobs"] = $jobStmt->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode([
    "message" => "Access granted to protected data",
    "user" => $user,
    "data" => $data
]);
?>
