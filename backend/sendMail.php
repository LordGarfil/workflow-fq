<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendMail($from, $name, $to, $subject, $message)
{

    require "vendor/autoload.php";

    $mail = new PHPMailer(true);

    try {

        $mail->isSMTP();
        $mail->Host = "smtp.gmail.com";
        $mail->SMTPAuth = true;
        $mail->Username = 'expressodeliveryuraba@gmail.com';
        $mail->Password = 'felipe123.';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom($from, $name);
        $mail->addAddress($to);

        if ($_FILES['adjunto']['name'] != null) {
            $mail->addAttachment($_FILES['adjunto']['tmp_name'], $_FILES['adjunto']['name']);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = $message;

        if ($mail->send()) {
            header("Location: successSend.php");
        } else {
            header("Location: failSend.php");
        }
    } catch (Exception $e) {
        header("Location: failSend.php");
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo} \n";
    }
}

function sendRecoverMail($to)
{

    require "vendor/autoload.php";
    require_once("dbConection.php");
    require_once("uuid.php");

    $mail = new PHPMailer(true);

    try {

        $sql = "SELECT id, nombre from usuarios where usuario = ?";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($to));

        $userRes = $sth->fetch(PDO::FETCH_ASSOC);

        $userName = $userRes['nombre'];
        $userId = $userRes['id'];

        $mail->isSMTP();
        $mail->Host = "smtp.gmail.com";
        $mail->SMTPAuth = true;
        $mail->Username = 'expressodeliveryuraba@gmail.com';
        $mail->Password = 'felipe123.';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $from = 'expressodeliveryuraba@gmail.com';
        $name = "Foto Quintero";

        $mail->setFrom($from, $name);
        $mail->addAddress($to);

        $token = generateUuid();

        $url = "http://" . $_SERVER['SERVER_NAME'] . "/wf-m/src/views/changePassword.php?userId=$userId&token=$token";

        $subject = "Recuperar contraseña";
        $message = "<p>Hola, <strong>$userName</strong>. Se ha solicitado la restauración de contraseña de tu cuenta.</p>
        <p> Para restaurar la contraseña, visita este enlace: </p>
        <p><a href=$url>RESTAURAR CONTRASEÑA</a>";

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = $message;

        if ($mail->send()) {
            $sql = "UPDATE usuarios SET peticion_contrasena = ?, token_contrasena = ? WHERE id = ?";
            $sth = $pdo->prepare($sql);
            $sth->execute(array(1, $token, $userId));
            print(json_encode(true));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "User does not exists"
            ]);
            print(json_encode($error[0]));
        }
    } catch (Exception $e) {
        $error = array([
            'error' => 'true',
            'message' => $mail->ErrorInfo
        ]);
        print(json_encode($error[0]));
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (
        isset($_POST['from']) && isset($_POST['name']) && isset($_POST['to']) && isset($_POST['subject'])
        && isset($_POST['message'])
    ) {
        sendMail($_POST['from'], $_POST['name'], $_POST['to'], $_POST['subject'], $_POST['message']);
    } else if (isset($_POST['to'])) {
        sendRecoverMail($_POST['to']);
    } else {
        $error = array([
            'error' => 'true',
            'message' => "Parameters missing"
        ]);
        print(json_encode($error[0]));
    }
}
