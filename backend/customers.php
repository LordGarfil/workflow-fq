<?php

function addCustomer($id, $name, $lastName, $phone, $email, $typePerson, $status, $creationDate)
{
    try {

        require_once("dbConection.php");

        $selectSql = "SELECT * FROM clientes WHERE numero_documento = ?";
        $sth = $pdo->prepare($selectSql);

        $sth->execute(array($id));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            $resStatus = array([
                'error' => 'true',
                'message' => "Customer already added"
            ]);
            print(json_encode($resStatus[0]));
            return;
        } else {
            $sql = ("INSERT INTO clientes (numero_documento, nombres, apellidos, celular, email, fk_tipo_persona,
         fk_estado_situacion, fecha_creacion) VALUES (:id, :name, :lastName, :phone, :email, :typePerson, :status,
         :creationDate)");

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                'id' => $id, 'name' => $name, 'lastName' => $lastName,
                'phone' => $phone, 'email' => $email, 'typePerson' => $typePerson,
                'status' => $status, 'creationDate' => $creationDate
            ]);

            $resStatus = array([
                'success' => 'true',
                'message' => "Customer successfully added"
            ]);
            print(json_encode($resStatus[0]));
        }
    } catch (PDOException $e) {
        $resStatus = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($resStatus[0]));
    }
}

function updateCustomer()
{
}

function findCustomers()
{

    try {
        require_once("dbConection.php");

        $sql = "select numero_documento as id, nombres as name, apellidos as lastName, celular as phone, email as email,
       fk_tipo_persona as customerType, fk_estado_situacion as status, fecha_creacion as creationDate
        from clientes order by nombres";

        $sth = $pdo->prepare($sql);

        $sth->execute();
        $customers = array();
        if ($customerRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($customers, $customerRes);
            while ($customerRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($customers, $customerRes);
            }
            print(json_encode(($customers)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No customers added"
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {

        switch ($_POST['action']) {
            case 'create':
                addCustomer(
                    $_POST['id'],
                    $_POST['name'],
                    $_POST['lastName'],
                    $_POST['phone'],
                    $_POST['email'],
                    $_POST['typePerson'],
                    $_POST['status'],
                    $_POST['creationDate']
                );
                break;

            case 'update':
                updateCustomer();
                break;

            default:
                $error = array([
                    'error' => 'true',
                    'message' => "This route does not exist"
                ]);
                print(json_encode($error[0]));
                break;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['filterBy'])) {

        switch ($_GET['filterBy']) {

            case 'all':
                findCustomers();
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
