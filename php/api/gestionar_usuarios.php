<?php
header('Content-Type: application/json');
require_once '../Auth.php';
require_once '../conexion.php';

$auth = new Auth();
if (!$auth->hasRole('admin')) {
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();
$input = json_decode(file_get_contents('php://input'), true);

$operacion = $input['operacion'] ?? '';
$id_usuario = $input['id_usuario'] ?? null;
$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$rol = $input['rol'] ?? 'cliente';

switch ($operacion) {
    case 'Alta':
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query = "INSERT INTO usuarios (nombre, apellido, email, contraseña, rol) VALUES (:nombre, :apellido, :email, :password, :rol)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':password', $hashed_password);
        break;
    case 'Modificación':
        $query = "UPDATE usuarios SET nombre=:nombre, apellido=:apellido, email=:email, rol=:rol WHERE id_usuario=:id_usuario";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        break;
    case 'Eliminación':
        $query = "DELETE FROM usuarios WHERE id_usuario=:id_usuario";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Operación no válida']);
        exit;
}

if ($operacion !== 'Eliminación') {
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':rol', $rol);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al ejecutar la operación']);
}
?>
