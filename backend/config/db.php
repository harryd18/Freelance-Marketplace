<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function getConnection() {
        $this->conn = null;

        // Load .env
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();

        $this->host = $_ENV['DB_HOST'] ?? null;
        $this->db_name = $_ENV['DB_NAME'] ?? null;
        $this->username = $_ENV['DB_USERNAME'] ?? null;
        $this->password = $_ENV['DB_PASSWORD'] ?? null;

        try {
            $ssl_ca = __DIR__ . "/../config/certs/DigiCertGlobalRootG2.crt.pem";

            $options = [
                PDO::MYSQL_ATTR_SSL_CA => $ssl_ca,
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // Important on Mac
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ];

            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            echo json_encode([
                "error" => "Database connection error",
                "details" => $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
