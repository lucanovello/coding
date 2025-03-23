<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

error_log("Contact form submission started.");

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Invalid request method.");
    header('X-Contact-Form-Status: error');
    exit();
}

$recaptchaSecretKey = process.env.prod-secret-key;
$recaptchaToken = $_POST['recaptcha_token'] ?? null;

if (!$recaptchaToken) {
    error_log("No reCAPTCHA token received.");
    header('X-Contact-Form-Status: error');
    exit();
}

// Verify reCAPTCHA with Google
$recaptchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$response = file_get_contents($recaptchaVerifyUrl . "?secret=" . $recaptchaSecretKey . "&response=" . $recaptchaToken);
$responseKeys = json_decode($response, true);

error_log("reCAPTCHA Response: " . print_r($responseKeys, true));

if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
    error_log("reCAPTCHA validation failed.");
    header('X-Contact-Form-Status: error');
    exit();
}

// Check reCAPTCHA score
if ($responseKeys["score"] < 0.5) {
    error_log("Low reCAPTCHA score: " . $responseKeys["score"]);
    header('X-Contact-Form-Status: error');
    exit();
}

// Form fields
$name = $_POST['name'] ?? 'Unknown';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'No Subject';
$message = $_POST['message'] ?? '';

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("Invalid email format: $email");
    header('X-Contact-Form-Status: error');
    exit();
}

// Set up PHPMailer
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.titan.email';  // Use Titan SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply@lucanovello.com';  // Your Hostinger email address
    $mail->Password = process.env.email-pass;  // Your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;  // Use STARTTLS encryption for port 587
    $mail->Port = 587;  // Use port 587 for STARTTLS encryption

    // Set the "From" address to a valid domain and allow replies to the user's email
    $mail->setFrom('noreply@lucanovello.com', "{$name}");  
    $mail->addReplyTo($email, $name);  

    // Recipients
    $mail->addAddress('luca@lucanovello.com');  

    // Email subject (formatted professionally)
    // $formattedSubject = "New Contact Form Submission from {$name} - {$subject}";
    $mail->Subject = $subject;

    // Professional email body with signature
    $emailBody = "
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
        <p><strong>Message:</strong></p>
        <p>{$message}</p>
        <hr>
    ";

    $mail->isHTML(true);
    $mail->Body = $emailBody;

    // Debugging (remove or set to 0 for production)
    $mail->SMTPDebug = 0;  

    $mail->send();
    header('X-Contact-Form-Status: success');
} catch (Exception $e) {
    error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    header('X-Contact-Form-Status: error');
}
?>
