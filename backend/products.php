<?php

function addProduct()
{
}

function updateProduct()
{
}

function findProducts()
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT id, descripcion as description, fk_categoria_producto as category, medidas as measures, precio as price,
    fecha_asignacion as creationDate from productos";
        $sth = $pdo->prepare($sql);
        $sth->execute();

        $products = array();
        if ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($products, $productRow);
            while ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($products, $productRow);
            }
            print(json_encode(($products)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No products added"
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

function findProductById()
{
}

function findProductsByCategory()
{
}

function findProductFromProject($id)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT p.id as id, p.descripcion as producto from productos_proyectos pp, productos p where
                pp.fk_producto = p.id and 
                fk_proyecto = ?";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($id));

        $products = array();
        if ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($products, $productRow);
            while ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($products, $productRow);
            }
            print(json_encode(($products)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No products found"
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
                addProduct();
                break;

            case 'update':
                updateProduct();
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

    switch ($_GET['filterBy']) {

        case 'all':
            findProducts();
            break;

        case 'id':
            findProductById();
            break;

        case 'category':
            findProductsByCategory();
            break;

        case 'fromProject':
            findProductFromProject($_GET['id']);
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
