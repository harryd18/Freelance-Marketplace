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
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["error" => "Email and password are required"]);
    exit();
}

$email = htmlspecialchars(strip_tags($data["email"]));
$password = $data["password"]; // raw password

// Fetch user by email only
$query = "SELECT * FROM users WHERE email = :email LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bindParam(":email", $email);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($password, $user["password"])) {
        unset($user["password"]); // don't send back hashed password

        // Simulate token generation (for future JWT)
        $token = bin2hex(random_bytes(16));

        echo json_encode([
            "message" => "Login successful",
            "user" => $user,
            "token" => $token
        ]);
    } else {
        echo json_encode(["error" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["error" => "Invalid email or password"]);
}
?>
