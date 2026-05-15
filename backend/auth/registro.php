<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

// Obtener datos del cuerpo de la petición
$input = json_decode(file_get_contents('php://input'), true);

$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// Validar que no haya campos vacíos
if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Verificar si el correo ya está registrado
    $checkQuery = "SELECT id_usuario FROM usuarios WHERE email = :email LIMIT 1";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'El correo electrónico ya está registrado.']);
        exit;
    }

    // Insertar el nuevo usuario (rol por defecto: cliente)
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $rol = 'cliente';

    $query = "INSERT INTO usuarios (nombre, apellido, email, contraseña, rol) VALUES (:nombre, :apellido, :email, :password, :rol)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':rol', $rol);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario en la base de datos.']);
    }

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
}
?>
