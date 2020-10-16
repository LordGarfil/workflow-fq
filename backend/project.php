<?php

$idtest;

function createProject(
    $category,
    $customer,
    $responsible,
    $value,
    $valuePaid,
    $observations,
    $beginDate,
    $finishDate,
    $status,
    $paymentStatus
) {
    try {

        require_once("dbConection.php");
        require_once("uuid.php");
        
        $correct = false;
        $uuid;
        do {

            $uuid = generateUuid();
            $sql = "SELECT * FROM proyectos where identificador_unico = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($uuid));
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($res) {
                echo ('<br> encontrado');
            } else {
                $correct = true;
            }
        } while ($correct == false);

        $project = [
            "uuid" => $uuid,
            "category" => $category,
            "customer" => $customer,
            "responsible" => $responsible,
            "value" => $value,
            "valuePaid" => $valuePaid,
            "observations" => $observations,
            "beginDate" => $beginDate,
            "finishDate" => $finishDate,
            "status" => $status,
            "paymentStatus" => $paymentStatus
        ];

        $sql = ("INSERT INTO proyectos (identificador_unico, fk_categoria_proyecto, fk_cliente, fk_responsable, valor_proyecto, valor_pagado,
         observaciones, fecha_inicio, fecha_finalizacion, fk_estado_proyecto, fk_estado_pago)
          VALUES (:uuid, :category, :customer, :responsible, :value, :valuePaid, :observations, :beginDate,
           :finishDate, :status, :paymentStatus )");

        $stmt = $pdo->prepare($sql);

        var_dump($stmt->execute([
            'uuid' => $project['uuid'], 'category' => $project['category'], 'customer' => $project['customer'],
            'responsible' => $project['responsible'], 'value' => $project['value'], 'valuePaid' => $project['valuePaid'],
            'observations' => $project['observations'], 'beginDate' => $project['beginDate'],
            'finishDate' => $project['finishDate'], 'status' => $project['status'],
            'paymentStatus' => $project['paymentStatus']
        ]));

        print_r($project);
    } catch (PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    createProject(
        $_POST['category'],
        $_POST['customer'],
        $_POST['responsible'],
        $_POST['value'],
        $_POST['valuePaid'],
        $_POST['observations'],
        $_POST['beginDate'],
        $_POST['finishDate'],
        $_POST['status'],
        $_POST['paymentStatus']
    );
}