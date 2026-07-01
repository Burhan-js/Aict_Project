<?php
// read.php
$filePath = __DIR__ . '/expenses.csv';
$data = [];


if (!file_exists($filePath)) {
// Return empty array if file doesn't exist yet
echo json_encode($data);
exit;
}


if (($f = fopen($filePath, 'r')) !== FALSE) {
// Read header (if present)
$header = fgetcsv($f);
while (($row = fgetcsv($f)) !== FALSE) {
// row is [id,date,category,description,amount]
$data[] = $row;
}
fclose($f);
}


header('Content-Type: application/json');
echo json_encode($data);
?>