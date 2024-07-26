<?php
header("Access-Control-Allow-Origin: *");
require_once "PHPMailer/PHPMailer/PHPMailer.php";
require_once "PHPMailer/PHPMailer/SMTP.php";
require_once "PHPMailer/PHPMailer/Exception.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
        $userName = $_POST['userName'] ?? ''; 
        $userEmail = $_POST['email'] ?? ''; 
        $userSubject = $_POST['subject'] ?? ''; 
        $userMessage = $_POST['msg'] ?? ''; 
        $subject = "Contact Us Form";
        $body = "Name: {$userName} <br> Email: {$userEmail} <br> Subject: {$userSubject} <br> Message: {$userMessage}";
        
            // Create a new PHPMailer instance
            $mail = new PHPMailer();

            $to = "kellylambeth93@gmail.com";  //The receiver's email address

            // SMTP settings
            $mail->isSMTP();
            // $mail->SMTPDebug = 3;  // Uncomment for debugging
            $mail->Host = "mail.gtsfastservice.com"; // SMTP address of your email
            $mail->SMTPAuth = false;
            $mail->Username = "info@gtsfastservice.com";
            $mail->Password = ""; // SMTP password
            $mail->Port = 465; // SMTP port
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Enable SSL encryption

            // Email settings
            $mail->isHTML(true);
            $mail->setFrom("info@gtsfastservice.com", "gtsfastservice Team");
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->addAddress($to);

            // Send email
            if ($mail->send()) {
              echo '<script type="text/javascript">alert("Form Submitted");</script>';
                header("Location: ../index.html");//echo json_encode('success');
                exit;
            } else {
                // Debugging: Log PHPMailer error
                echo json_encode('failed');
            }
} catch (Exception $e) {
    header("Location: ../index.html");//echo json_encode('success');
                exit;
}

?>
