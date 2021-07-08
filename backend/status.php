<?php

function findProjectStatus()
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT * from estados_proyecto ep";
        $sth = $pdo->prepare($sql);
        $sth->execute();

        $status = array();
        if ($statusRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($status, $statusRow);
            while ($statusRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($status, $statusRow);
            }
            print(json_encode(($status)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No status added"
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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['filterBy'])) {

        switch ($_GET['filterBy']) {

            case 'project':
                findProjectStatus();
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
