<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$type = $_GET['type'] ?? '';
$value = $_GET['value'] ?? '';

if (empty($type) || empty($value)) {
    echo json_encode(['available' => false]);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

if ($type === 'username') {
    $query = "SELECT COUNT(*) FROM usuarios WHERE email = :value";
} else if ($type === 'producto') {
    $query = "SELECT COUNT(*) FROM muebles WHERE nombre = :value";
} else {
    echo json_encode(['available' => false]);
    exit;
}

$stmt = $conn->prepare($query);
$stmt->bindParam(':value', $value);
$stmt->execute();
$count = $stmt->fetchColumn();

echo json_encode(['available' => $count == 0]);
?>
