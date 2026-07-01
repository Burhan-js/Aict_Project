<?php
// delete.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
echo 'invalid';
exit;
}


$id = isset($_POST['id']) ? trim($_POST['id']) : '';
if ($id === '') {
echo 'invalid';
exit;
}


$filePath = __DIR__ . '/expenses.csv';
if (!file_exists($filePath)) {
echo 'not_found';
exit;
}


$rows = [];
if (($f = fopen($filePath, 'r')) !== FALSE) {
$header = fgetcsv($f); // preserve header
while (($row = fgetcsv($f)) !== FALSE) {
if ($row[0] != $id) {
$rows[] = $row;
}
}
fclose($f);
}


// write back
if (($f = fopen($filePath, 'w')) !== FALSE) {
if ($header) fputcsv($f, $header);
foreach ($rows as $r) {
fputcsv($f, $r);
}
fclose($f);
echo 'deleted';
} else {
echo 'file_error';
}
?>