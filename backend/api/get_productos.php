<?php
header('Content-Type: application/json; charset=utf-8');
try {
    require_once '../config/conexion.php';
    $db = new Database();
    $conn = $db->getConnection();

    $query = "SELECT * FROM muebles"; 
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $resultado = array_map(function($row) {
        return [
            'id' => (int)($row['id_mueble'] ?? $row['id'] ?? 0),
            'nombre' => $row['nombre'] ?? 'Sin nombre',
            'categoria' => $row['categoria'] ?? 'General',
            'precio' => (float)($row['precio'] ?? 0),
            'descripcion' => $row['decripcion'] ?? $row['descripcion'] ?? '',
            'enOferta' => (bool)($row['en_oferta'] ?? 0),
            'img' => $row['imagen_url'] ?? $row['img'] ?? 'assets/img/default.jpg'
        ];
    }, $productos);

    $json = json_encode($resultado, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        throw new Exception("Error al codificar JSON: " . json_last_error_msg());
    }
    echo $json;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
