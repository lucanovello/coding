<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the form data
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  $age = $_POST['age'];
  $smoker = $_POST['smoker'];
  $subject = $_POST['subject'];
  $finalSubject = 'Message from rizzainsurance.com';
  $message = "From: $name\nPhone: $phone\nAge: $age\nSmoker: $smoker\n\nSubject: $subject\nMessage:\n" . $_POST['message'];

  // Build the email headers
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  // Send the email
  mail('joe@rizzainsurance.com', $finalSubject, $message, $headers);

  // Send a response header to indicate success
  header('X-Contact-Form-Status: success');
} else {
  // Send a response header to indicate failure
  header('X-Contact-Form-Status: error');
}
?>


