<?php
header('Content-Type: application/json');
try {
    require_once '../auth/auth.php';
    require_once '../config/conexion.php';

    $auth = new Auth();
    if (!$auth->hasRole('admin')) {
        echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
        exit;
    }

    $db = new Database();
    $conn = $db->getConnection();

    $operacion = $_POST['operacion'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $precio = $_POST['precio'] ?? 0;
    $descripcion = $_POST['descripcion'] ?? '';
    $id_mueble = $_POST['id_mueble'] ?? null;
    
    $imagen_url = '';

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = time() . '_' . basename($_FILES['imagen']['name']);
        $rutaDestino = "../../../public/assets/img/" . $nombreArchivo;
        if (!is_dir("../../../public/assets/img/")) {
            mkdir("../../../public/assets/img/", 0777, true);
        }
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            $imagen_url = "assets/img/" . $nombreArchivo;
        }
    }

    switch ($operacion) {
        case 'Alta':
            if (empty($imagen_url)) $imagen_url = 'assets/img/default.jpg';
            $query = "INSERT INTO muebles (nombre, categoria, precio, descripcion, imagen_url) VALUES (:nombre, :categoria, :precio, :descripcion, :imagen_url)";
            $stmt = $conn->prepare($query);
            break;
        case 'Modificación':
            if (!empty($imagen_url)) {
                $query = "UPDATE muebles SET nombre=:nombre, categoria=:categoria, precio=:precio, descripcion=:descripcion, imagen_url=:imagen_url WHERE id_mueble=:id_mueble";
            } else {
                $query = "UPDATE muebles SET nombre=:nombre, categoria=:categoria, precio=:precio, descripcion=:descripcion WHERE id_mueble=:id_mueble";
            }
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id_mueble', $id_mueble);
            break;
        case 'Eliminación':
            $query = "DELETE FROM muebles WHERE id_mueble=:id_mueble";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id_mueble', $id_mueble);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Operación no válida']);
            exit;
    }

    if ($operacion !== 'Eliminación') {
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':descripcion', $descripcion);
        if ($operacion === 'Alta' || !empty($imagen_url)) {
            $stmt->bindParam(':imagen_url', $imagen_url);
        }
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al ejecutar la operación']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
