<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the form data
  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  // Build the email headers
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  // Send the email
  mail('luca@lucanovello.com', $subject, $message, $headers);

  
  // Send a response header to indicate success
  header('X-Contact-Form-Status: success');
} else {
  // Send a response header to indicate failure
  header('X-Contact-Form-Status: error');
}
?>
