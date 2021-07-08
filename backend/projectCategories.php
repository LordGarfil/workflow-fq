<?php

function findProjectCategories()
{
    try {
        require_once("dbConection.php");

        $sql = "select id, categoria as category from categorias_proyecto ";

        $sth = $pdo->prepare($sql);
        $sth->execute(array());

        $projectCategories = array();
        if ($categoryRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($projectCategories, $categoryRow);
            while ($categoryRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($projectCategories, $categoryRow);
            }
            print(json_encode(($projectCategories)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "This project do not have products"
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
    // addProductsProject(
    //     $_POST['id'],
    //     $_POST['quantity'],
    //     $_POST['instructions'],
    //     $_POST['installable'],
    //     $_POST['address']
    // );
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['filterBy'])) {

        switch ($_GET['filterBy']) {

            case 'all':
                findProjectCategories();
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
