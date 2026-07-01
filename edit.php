<?php
// edit.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo 'invalid';
  exit;
}

$id = isset($_POST['id']) ? trim($_POST['id']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$amount = isset($_POST['amount']) ? trim($_POST['amount']) : '';

if ($id === '' || $date === '' || $category === '' || $amount === '') {
  echo 'invalid';
  exit;
}

$filePath = __DIR__ . '/expenses.csv';
if (!file_exists($filePath)) {
  echo 'not_found';
  exit;
}

$rows = [];
$updated = false;

if (($f = fopen($filePath, 'r')) !== FALSE) {
  $header = fgetcsv($f); // preserve header
  while (($row = fgetcsv($f)) !== FALSE) {
    if ($row[0] == $id) {
      // Replace with updated values
      $rows[] = [$id, $date, $category, $description, $amount];
      $updated = true;
    } else {
      $rows[] = $row;
    }
  }
  fclose($f);
}

if (!$updated) {
  echo 'not_found';
  exit;
}

// Write back
if (($f = fopen($filePath, 'w')) !== FALSE) {
  if ($header) fputcsv($f, $header);
  foreach ($rows as $r) {
    fputcsv($f, $r);
  }
  fclose($f);
  echo 'updated';
} else {
  echo 'file_error';
}
?>
