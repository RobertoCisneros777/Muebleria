<?php
header('Content-Type: application/json');
try {
    require_once '../Auth.php';
    $auth = new Auth();
    $userData = $auth->getUserData();

    if ($userData) {
        echo json_encode(['logged_in' => true, 'user' => $userData]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['logged_in' => false, 'error' => true, 'message' => $e->getMessage()]);
}
?>
