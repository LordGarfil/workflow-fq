<?php

function addUser()
{
}

function updateUser()
{
}

function findUsers()
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT id, nombre AS name, usuario AS email, fk_estado_situacion AS status, fecha_creacion AS creationDate FROM usuarios where fk_estado_situacion = 1 ORDER BY nombre";
        $sth = $pdo->prepare($sql);
        $sth->execute();

        $users = array();
        if ($userRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($users, $userRow);
            while ($userRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($users, $userRow);
            }
            print(json_encode(($users)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No users added"
            ]);
            print(json_encode($error[0]));
        }
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function findUserByEmail($email)
{
    try{

        require_once("dbConection.php");

        $sql = "SELECT id from usuarios where usuario = ?";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($email));

        if ($userRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($userRes['id'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "User does not exists"
            ]);
            print(json_encode($error[0]));
        }
    }catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }

    
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'create':
                addUser();
                break;

            case 'update':
                updateUser();
                break;

            default:
                $error = array([
                    'error' => 'true',
                    'message' => "This route does not exist"
                ]);
                print(json_encode($error[0]));
                break;;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['filterBy'])) {

        switch ($_GET['filterBy']) {

            case 'all':
                findUsers();
                break;

            case 'email':
                findUserByEmail($_GET['email']);
                break;

            default:
                $error = array([
                    'error' => 'true',
                    'message' => "This route does not exist"
                ]);
                print(json_encode($error[0]));
                break;
        }
    } else {
        $error = array([
            'error' => 'true',
            'message' => "This route does not exist"
        ]);
        print(json_encode($error[0]));
        return;
    }
}
