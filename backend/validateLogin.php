<?php
    require_once("dbConection.php");

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $email = $_POST['user'];
        $password = $_POST['pass'];
        $userId = "";
    
        $sql = "SELECT * FROM usuarios where usuario = ?";
        $sth = $pdo->prepare($sql);

        $sth -> execute(array($email));
    
    if($userRes = $sth->fetch()){
        
        if(password_verify($password, $userRes['contrasena'])){
            $userId = $userRes['id'];

        $sql2 = "SELECT fk_rol_usuario FROM roles_usuario_det where fk_usuario = ?";
        $sth2 = $pdo->prepare($sql2);
        $sth2 -> execute(array($userId));

    $userRolRes = $sth2->fetch(PDO::FETCH_ASSOC);

    $sql3 = "SELECT nombres, apellidos FROM personas where email = ?";
    $sth3 = $pdo->prepare($sql3);
    $sth3 -> execute(array($email));

    $res = $sth3->fetch(PDO::FETCH_ASSOC);

        if($userRolRes['fk_rol_usuario'] == 1){
            
            session_start();

            $_SESSION['name'] = $res['nombres'];
            $_SESSION['lastName'] = $res['apellidos'];

            $_SESSION['user'] = $email;
            $_SESSION['password'] = $password;
            $_SESSION['rol'] = $userRolRes['fk_rol_usuario'];
            $_SESSION['userId'] = $userId;
            // header("Location: ../admin/index.php"); 
            print(1);

        }else{
            print(2);
            return 1;
        }
        }else{
            print(0);
        }
    }else{
        print(0);
    }
    }

    



