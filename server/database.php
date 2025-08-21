<?php
// Database connection for XAMPP MySQL
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class Database {
    private $host = 'localhost';
    private $port = '3306';
    private $dbname = 'ialibu_school';  // Use the database name from XAMPP import
    private $username = 'root';         // Default XAMPP MySQL username
    private $password = '';             // Default XAMPP MySQL password (empty)
    private $pdo;

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8mb4";
            $this->pdo = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Database connection failed',
                'message' => $e->getMessage(),
                'details' => [
                    'host' => $this->host,
                    'port' => $this->port,
                    'database' => $this->dbname,
                    'suggestion' => 'Make sure XAMPP MySQL is running and database exists'
                ]
            ]);
            exit;
        }
    }

    public function getConnection() {
        return $this->pdo;
    }

    // Test database connection
    public function testConnection() {
        try {
            $stmt = $this->pdo->query("SELECT 1");
            return [
                'success' => true,
                'message' => 'Database connected successfully',
                'database' => $this->dbname
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Database connection test failed',
                'error' => $e->getMessage()
            ];
        }
    }

    // Get database statistics
    public function getStats() {
        try {
            $stats = [];
            
            // Get table counts
            $tables = ['students', 'users', 'staff', 'attendance', 'grades', 'finance'];
            foreach ($tables as $table) {
                $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM {$table}");
                $result = $stmt->fetch();
                $stats[$table] = $result['count'];
            }
            
            return [
                'success' => true,
                'stats' => $stats,
                'database' => $this->dbname
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}

// Handle API requests
$database = new Database();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'test':
        echo json_encode($database->testConnection());
        break;
        
    case 'stats':
        echo json_encode($database->getStats());
        break;
        
    default:
        echo json_encode([
            'message' => 'Ialibu School Management API',
            'database' => 'Connected to XAMPP MySQL',
            'available_actions' => ['test', 'stats'],
            'usage' => [
                'test' => '?action=test',
                'stats' => '?action=stats'
            ]
        ]);
}
?>
