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

    $stmt = $conn->prepare("SELECT id_mueble, nombre, categoria, precio, descripcion, imagen_url FROM muebles WHERE id_mueble = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $producto = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($producto) {
        echo json_encode(['success' => true, 'data' => $producto]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Producto no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
