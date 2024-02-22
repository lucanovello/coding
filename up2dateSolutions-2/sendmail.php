<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the form data
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $company = $_POST['company'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $finalSubject = 'Message from up2datesolutions.com';
  $message = "From: $name\nPhone: $phone\nCompany: $company\nSubject: $subject\n\nMessage:\n" . $_POST['message'];

  // Build the email headers
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  // Send the email
  mail('enzo@up2datesolutions.com', $finalSubject, $message, $headers);

  // Send a response header to indicate success
  header('X-Contact-Form-Status: success');
} else {
  // Send a response header to indicate failure
  header('X-Contact-Form-Status: error');
}
?>


