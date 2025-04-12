<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include_once "../config/db.php";

$database = new Database();
$conn = $database->getConnection();

$query = "SELECT * FROM jobs ORDER BY id DESC";
$stmt = $conn->prepare($query);

if ($stmt->execute()) {
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($jobs);
} else {
    echo json_encode(["error" => "Failed to fetch jobs"]);
}
?>
