<?php

// Get the value from the POST request
$data = json_decode(file_get_contents("php://input"));

if ($data && isset($data->value)) {
    $value = $data->value;

    // Path to the file where you want to save the value
    $filePath = '~/public_html/output.txt';

    // Save the value to the file
    if (file_put_contents($filePath, $value . PHP_EOL, FILE_APPEND | LOCK_EX) !== false) {
        http_response_code(200);
        echo "Value saved to file";
    } else {
        http_response_code(500);
        echo "Error saving value to file";
    }
} else {
    http_response_code(400);
    echo "Invalid request";
}
?>
