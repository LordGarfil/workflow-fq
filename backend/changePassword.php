<?php

function changePassword($newPass)
{
    try {
        require_once("dbConection.php");
        session_start();
        $userId = $_SESSION['tempId'];
        $securePass = password_hash($newPass, PASSWORD_ARGON2ID);

        $sql = "UPDATE usuarios SET contrasena = ? WHERE id = ?";
            $sth = $pdo->prepare($sql);
            $sth->execute(array($securePass, $userId));

            $sql = "UPDATE usuarios SET peticion_contrasena = ?, token_contrasena = ? WHERE id = ?";
            $sth = $pdo->prepare($sql);
            $sth->execute(array(0, "", $userId));

                session_destroy();
                print(json_encode(true));
                return true;

    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
        return $error[0];
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  changePassword($_POST['pass']);
}
