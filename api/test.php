<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo json_encode([
  "resultado" => "ok",
  "datos" => [["0001", "Viaje demo", "", "", "", "", 9468, 9506, 0, "0020", "Test", "I", "Iniciado", "Madrid", "Barcelona", ""]]
]);
