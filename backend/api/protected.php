<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Extract token from Authorization header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied - No token provided"]);
    exit;
}

$authHeader = $headers['Authorization'];
list($type, $token) = explode(" ", $authHeader, 2);

// Mock check: accept any token that is 32 characters long 
if ($type === "Bearer" && strlen($token) === 32) {
    echo json_encode([
        "message" => "Access granted to protected data",
        "data" => [
            "userProjects" => [
                "Website Redesign",
                "Client Portal",
                "Bug Fix Sprint"
            ]
        ]
    ]);
} else {
    http_response_code(403);
    echo json_encode(["error" => "Access denied"]);
}
?>
