<?php
class Database {
    private $host = "127.0.0.1";
    private $db_name = "freelance_marketplace";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Show DB errors
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Optional: auto-assoc array
                ]
            );
        } catch (PDOException $exception) {
            echo json_encode(["error" => "Database connection error", "details" => $exception->getMessage()]);
            exit;
        }

        return $this->conn;
    }
}
?>
