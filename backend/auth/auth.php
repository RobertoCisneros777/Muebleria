<?php
require_once '../config/conexion.php';

class Auth {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function login($email, $password) {
        $query = "SELECT id_usuario, nombre, apellido, email, contraseña, rol FROM usuarios WHERE email = :email LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $row['contraseña'])) {
                $_SESSION['user_id'] = $row['id_usuario'];
                $_SESSION['nombre'] = $row['nombre'];
                $_SESSION['apellido'] = $row['apellido'];
                $_SESSION['rol'] = $row['rol'];
                return true;
            }
        }
        return false;
    }

    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public function getUserData() {
        if($this->isLoggedIn()) {
            return [
                'id' => $_SESSION['user_id'],
                'nombre' => $_SESSION['nombre'],
                'apellido' => $_SESSION['apellido'],
                'rol' => $_SESSION['rol']
            ];
        }
        return null;
    }

    public function logout() {
        session_destroy();
        return true;
    }

    public function hasRole($role) {
        return isset($_SESSION['rol']) && strtolower(trim($_SESSION['rol'])) === strtolower(trim($role));
    }
}
?>
