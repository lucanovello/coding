<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the form data
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $finalSubject = 'MESSAGE RECEIVED from foxtailpropertyservices.com';
  $message = "From: $name\nPhone: $phone\nEmail: $email\n\nSubject: $subject\nMessage:\n" . $_POST['message'];
  // Build the email headers
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  // Send the email
  mail('frank@foxtailpropertyservices.com', $finalSubject, $message, $headers);

  // Send a response header to indicate success
  header('X-Contact-Form-Status: success');
} else {
  // Send a response header to indicate failure
  header('X-Contact-Form-Status: error');
}
?>


