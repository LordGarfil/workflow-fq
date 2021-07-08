<?php

function auth($email, $pass)
{
    try {
        require_once("dbConection.php");
    
    $userId = "";

    $sql = "SELECT * FROM usuarios where usuario = ?";
    $sth = $pdo->prepare($sql);

    $sth->execute(array($email));

    if ($userRes = $sth->fetch()) {

        if (password_verify($pass, $userRes['contrasena'])) {
            $userId = $userRes['id'];

            $sql2 = "SELECT fk_rol_usuario FROM roles_usuario_det where fk_usuario = ?";
            $sth2 = $pdo->prepare($sql2);
            $sth2->execute(array($userId));

            $userRolRes = $sth2->fetch(PDO::FETCH_ASSOC);

            if ($userRolRes['fk_rol_usuario'] == 1) {

                session_start();

                $_SESSION['name'] = $userRes['nombre'];

                $_SESSION['user'] = $email;
                $_SESSION['rol'] = $userRolRes['fk_rol_usuario'];
                $_SESSION['userId'] = $userId;
                $user = array(
                    [
                        'role' => $userRolRes['fk_rol_usuario']
                    ]
                );
                print(json_encode($user[0]));
                return;
            } else {
                session_start();

                $_SESSION['name'] = $userRes['nombre'];

                $_SESSION['user'] = $email;
                $_SESSION['rol'] = $userRolRes['fk_rol_usuario'];
                $_SESSION['userId'] = $userId;
                $user = array(
                    [
                        'role' => $userRolRes['fk_rol_usuario']
                    ]
                );
                print(json_encode($user[0]));
                return;
            }
        } else {
            $error = array([
                'error' => 'true',
                'message' => "User or password doesn't match"
            ]);
            print(json_encode($error[0]));
            return;
        }
    } else {
        $error = array([
            'error' => 'true',
            'message' => "User or password doesn't match"
        ]);
        print(json_encode($error[0]));
        return;
    }
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}



if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    auth(
         $_POST['user'],
         $_POST['pass']
        );
}