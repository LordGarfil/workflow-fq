<?php

function addProductsProject($productId, $quantity, $instructions, $installable, $address)
{
    try {
        require_once("dbConection.php");
      
        $sqlProjectId = "SELECT id
            FROM proyectos
           ORDER
              BY Id DESC
           LIMIT 1";
        $stmtProjectId = $pdo->prepare($sqlProjectId);
        $stmtProjectId->execute();
        $resProjectId = $stmtProjectId->fetchAll(PDO::FETCH_ASSOC);

        $product = [
            "projectId" => $resProjectId[0]['id'],
            "productId" => $productId,
            "quantity" => $quantity,
            "instructions" => $instructions,
            "installable" => $installable,
            "address" => $address
        ];


        $sql = ("INSERT INTO productos_proyectos (fk_proyecto, fk_producto, cantidad, instrucciones, instalable,
         direccion)
          VALUES (:projectId, :productId, :quantity, :instructions, :installable, :address)");

        $stmt = $pdo->prepare($sql);

        var_dump($stmt->execute([
            'projectId' => $product['projectId'], 'productId' => $product['productId'], 'quantity' => $product['quantity'],
            'instructions' => $product['instructions'], 'installable' => $product['installable'],
            'address' => $product['address']
        ]));

        print_r($product);
    } catch (PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    addProductsProject(
        $_POST['id'],
        $_POST['quantity'],
        $_POST['instructions'],
        $_POST['installable'],
        $_POST['address']
    );
}
