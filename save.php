<?php
// save.php
if ($_SERVER["REQUEST_METHOD"] == 'POST') {
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$amount = isset($_POST['amount']) ? trim($_POST['amount']) : '';


if ($date === '' || $category === '' || $amount === '') {
echo 'invalid';
exit;
}


$id = time();


$filePath = __DIR__ . '/expenses.csv';


// If file doesn't exist, create and add header
if (!file_exists($filePath)) {
$f = fopen($filePath, 'w');
fputcsv($f, ['id', 'date', 'category', 'description', 'amount']);
fclose($f);
// set permissions if possible (best-effort)
@chmod($filePath, 0666);
}


$f = fopen($filePath, 'a');
if ($f === false) {
echo 'file_error';
exit;
}
// simple CSV write
fputcsv($f, [$id, $date, $category, $description, $amount]);
fclose($f);
echo 'success';
}
?>










