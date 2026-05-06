<?php
header('Content-Type: application/json');
try {
    require_once '../Auth.php';
    require_once '../conexion.php';

    $auth = new Auth();
    if (!$auth->hasRole('admin')) {
        echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
        exit;
    }

    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
        exit;
    }

    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        echo json_encode(['success' => true, 'data' => $usuario]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
