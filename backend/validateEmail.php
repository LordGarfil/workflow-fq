<?php

function emailExists($email)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT * from usuarios where usuario = ?";
            $sth = $pdo->prepare($sql);
            $sth->execute(array($email));

            $emailRes = $sth->fetch(PDO::FETCH_ASSOC);

            if($emailRes){
                print(json_encode(true));
                return true;
            }else{
                $error = array([
                    'error' => 'true',
                    'message' => "Este correo no existe"
                ]);
                print(json_encode($error[0]));
                return false;
            }

    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
        return $error[0];
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['email'])) {
        emailExists($_GET['email']);
    }else{
        $error = array([
            'error' => 'true',
            'message' => "Parameters missing"
        ]);
        print(json_encode($error[0]));
    }
}

?>