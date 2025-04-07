<?php
require "../vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");

$secret_key = "your_secret_key_here";  

function verifyJWT() {
    global $secret_key;
    
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        echo json_encode(["error" => "Token missing"]);
        http_response_code(401);
        exit();
    }

    $jwt = trim(str_replace("Bearer", "", $_SERVER['HTTP_AUTHORIZATION']));

    try {
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        echo json_encode(["error" => "Invalid or expired token"]);
        http_response_code(401);
        exit();
    }
}
?>
