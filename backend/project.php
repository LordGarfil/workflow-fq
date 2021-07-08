<?php

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

        $sql = "CALL createProject(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $project['uuid'], $project['category'], $project['customer'],
            $project['responsible'], $project['value'], $project['valuePaid'],
            $project['observations'], $project['beginDate'],
            $project['finishDate'], $project['status'],
            $project['paymentStatus']
        ]);

        print_r(json_encode(($project)));
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function updateProject(
    $id,
    $category,
    $customer,
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

        date_default_timezone_set("America/Bogota");
        $updateDate = date("Y/m/d") . date("h:i:sa");

        $sql = ("UPDATE proyectos SET fk_categoria_proyecto = ?, fk_cliente = ?, valor_proyecto = ?,
        valor_pagado = ?, observaciones = ?, fecha_inicio = ?, fecha_finalizacion = ?, fk_estado_proyecto = ?,
        fk_estado_pago = ?, fecha_ultima_actualizacion = ? where id = ?");

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $category, $customer, $value, $valuePaid, $observations, $beginDate, $finishDate, $status,
            $paymentStatus, $updateDate, $id
        ]);

        print(json_encode(array([
            "id" => $id,
            "category" => $category,
            "customer" => $customer,
            "value" => $value,
            "valuePaid" => $valuePaid,
            "observations" => $observations,
            "beginDate" => $beginDate,
            "finishDate" => $finishDate,
            "status" => $status,
            "paymentStatus" => $paymentStatus
        ])));
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function findProjects()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id, identificador_unico as uuid, categorias_proyecto.categoria as category, 
        concat(clientes.nombres, ' ', clientes.apellidos) as customer, usuarios.nombre as responsible,
        observaciones as observations, fecha_inicio as beginDate, fecha_finalizacion as finishDate,
        estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate, fecha_ultima_actualizacion as lastUpdateDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto
        where
                estados_proyecto.id = proyectos.fk_estado_proyecto AND
                categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
                usuarios.id = proyectos.fk_responsable AND
                clientes.numero_documento = proyectos.fk_cliente ORDER BY proyectos.id DESC";

        $sth = $pdo->prepare($sql);

        $sth->execute(array());
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function findProjectById($projectId)
{

    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id as projectNo, identificador_unico as uuid, categorias_proyecto.categoria as category,
        categorias_proyecto.id AS categoryId,
    concat(clientes.nombres, ' ' , clientes.apellidos) as customer, clientes.numero_documento AS customerId,
       usuarios.nombre as responsible, usuarios.id AS responsibleId, valor_proyecto as value, valor_pagado as paidValue,
     proyectos.observaciones as observations, proyectos.fecha_inicio as beginDate, proyectos.fecha_finalizacion as finishDate,
      estados_proyecto.estado as status, estados_pago.id as paymentStatusId, estados_pago.estado as paymentStatus, estados_proyecto.id AS statusId, proyectos.fecha_creacion as creationDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto, estados_pago
   where
         estados_proyecto.id = proyectos.fk_estado_proyecto AND
         categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
         usuarios.id = proyectos.fk_responsable AND
         clientes.numero_documento = proyectos.fk_cliente AND
         estados_pago.id = fk_estado_pago AND
         proyectos.id = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array($projectId));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function findProjectByUuid($uuid)
{
}

function findProjectByCategory($category)
{
}

function findProjectByCustomer($customer)
{
}

function findProjectsByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        // $sql = "SELECT * FROM proyectos WHERE proyectos.fk_responsable = ? AND proyectos.fk_estado_proyecto = 1 ";
        $sql = "SELECT proyectos.id as id, identificador_unico as uuid, categorias_proyecto.categoria as category,
        categorias_proyecto.id AS categoryId,
    concat(clientes.nombres, ' ' , clientes.apellidos) as customer, clientes.numero_documento AS customerId,
       usuarios.nombre as responsible, usuarios.id AS responsibleId, valor_proyecto as value, valor_pagado as paidValue,
     proyectos.observaciones as observations, proyectos.fecha_inicio as beginDate, proyectos.fecha_finalizacion as finishDate,
      estados_proyecto.estado as status, estados_pago.id as paymentStatusId, estados_pago.estado as paymentStatus, estados_proyecto.id AS statusId, proyectos.fecha_creacion as creationDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto, estados_pago
   where
         estados_proyecto.id = proyectos.fk_estado_proyecto AND
         categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
         usuarios.id = proyectos.fk_responsable AND
         clientes.numero_documento = proyectos.fk_cliente AND
         estados_pago.id = fk_estado_pago AND
         proyectos.fk_responsable = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array($responsible));
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function findLastProjectByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id as projectNo, identificador_unico as uuid, categorias_proyecto.categoria as category,
        categorias_proyecto.id AS categoryId,
    concat(clientes.nombres, ' ' , clientes.apellidos) as customer, clientes.numero_documento AS customerId,
       usuarios.nombre as responsible, usuarios.id AS responsibleId, valor_proyecto as value, valor_pagado as paidValue,
     proyectos.observaciones as observations, proyectos.fecha_inicio as beginDate, proyectos.fecha_finalizacion as finishDate,
      estados_proyecto.estado as status, estados_pago.id as paymentStatusId, estados_pago.estado as paymentStatus, estados_proyecto.id AS statusId, proyectos.fecha_creacion as creationDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto, estados_pago
   where
         estados_proyecto.id = proyectos.fk_estado_proyecto AND
         categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
         usuarios.id = proyectos.fk_responsable AND
         clientes.numero_documento = proyectos.fk_cliente AND
         estados_pago.id = fk_estado_pago AND proyectos.fk_estado_proyecto = 1
			order by proyectos.id desc LIMIT 1";

        $sth = $pdo->prepare($sql);

        $sth->execute(array($responsible));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function findProjectByBeginDate($beginDate)
{
}

function findProjectByfinishDate($finishDate)
{
}

function findProjectByStatus($status)
{
}

function findProjectByCreationDate($creationDate)
{
}

function fetchAllScheduled()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id, identificador_unico as uuid, categorias_proyecto.categoria as category, 
        concat(clientes.nombres, ' ', clientes.apellidos) as customer, usuarios.nombre as responsible,
        observaciones as observations, fecha_inicio as beginDate, fecha_finalizacion as finishDate,
        estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate, fecha_ultima_actualizacion as lastUpdateDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto
        where
                estados_proyecto.id = proyectos.fk_estado_proyecto AND
                categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
                usuarios.id = proyectos.fk_responsable AND
                clientes.numero_documento = proyectos.fk_cliente
                AND proyectos.fk_estado_proyecto = ? ORDER BY proyectos.id DESC";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1));
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No hay proyectos encontrados"
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

function fetchAllActive()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id, identificador_unico as uuid, categorias_proyecto.categoria as category, 
        concat(clientes.nombres, ' ', clientes.apellidos) as customer, usuarios.nombre as responsible,
        observaciones as observations, fecha_inicio as beginDate, fecha_finalizacion as finishDate,
        estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate, fecha_ultima_actualizacion as lastUpdateDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto
        where
                estados_proyecto.id = proyectos.fk_estado_proyecto AND
                categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
                usuarios.id = proyectos.fk_responsable AND
                clientes.numero_documento = proyectos.fk_cliente
                AND proyectos.fk_estado_proyecto = ? ORDER BY proyectos.id DESC";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(2));
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No hay proyectos encontrados"
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

function fetchAllCanceled()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id, identificador_unico as uuid, categorias_proyecto.categoria as category, 
        concat(clientes.nombres, ' ', clientes.apellidos) as customer, usuarios.nombre as responsible,
        observaciones as observations, fecha_inicio as beginDate, fecha_finalizacion as finishDate,
        estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate, fecha_ultima_actualizacion as lastUpdateDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto
        where
                estados_proyecto.id = proyectos.fk_estado_proyecto AND
                categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
                usuarios.id = proyectos.fk_responsable AND
                clientes.numero_documento = proyectos.fk_cliente
                AND proyectos.fk_estado_proyecto = ? ORDER BY proyectos.id DESC";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(4));
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No hay proyectos encontrados"
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

function fetchAllDelayed()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT proyectos.id, identificador_unico as uuid, categorias_proyecto.categoria as category, 
        concat(clientes.nombres, ' ', clientes.apellidos) as customer, usuarios.nombre as responsible,
        observaciones as observations, fecha_inicio as beginDate, fecha_finalizacion as finishDate,
        estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate, fecha_ultima_actualizacion as lastUpdateDate
         FROM proyectos, categorias_proyecto, clientes, usuarios, estados_proyecto
        where
                estados_proyecto.id = proyectos.fk_estado_proyecto AND
                categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
                usuarios.id = proyectos.fk_responsable AND
                clientes.numero_documento = proyectos.fk_cliente AND
                proyectos.fk_estado_proyecto BETWEEN 1 AND 2 AND
                proyectos.fecha_finalizacion < ? ORDER BY proyectos.id DESC";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(date("Y-m-d")));
        $projects = array();
        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push(($projects), $projectRes);
            while ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push(($projects), $projectRes);
            }
            print(json_encode(($projects)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No hay proyectos encontrados"
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

function countAllScheduled()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM proyectos WHERE fk_estado_proyecto = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countAllActive()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM proyectos WHERE fk_estado_proyecto = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(2));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countAllDelayed()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM proyectos WHERE fk_estado_proyecto BETWEEN ? AND ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1, 2));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countAllCanceled()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM proyectos WHERE fk_estado_proyecto = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(4));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countScheduledByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM etapas_proyecto_det epd 
                WHERE epd.fk_estado_etapa = ? AND fk_responsable = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1, $responsible));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countActiveByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM etapas_proyecto_det epd 
                WHERE epd.fk_estado_etapa = ? AND fk_responsable = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(2, $responsible));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countDelayedByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT Count(*) FROM etapas_proyecto_det epd
                INNER JOIN productos_proyectos pp ON epd.fk_producto_proyecto = pp.id
                INNER JOIN proyectos pr ON pp.fk_proyecto = pr.id
                WHERE epd.fk_estado_etapa BETWEEN ? AND ? AND
                epd.fk_responsable = ?
                AND pr.fecha_finalizacion < ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1, 2, $responsible, date("Y-m-d")));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['Count(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countCanceledByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM etapas_proyecto_det epd 
                WHERE epd.fk_estado_etapa = ? AND fk_responsable = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(4, $responsible));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function countReprocessingByResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT COUNT(*) FROM etapas_proyecto_det epd 
                WHERE epd.reproceso = ? AND fk_responsable = ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array(1, $responsible));

        if ($projectRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes['COUNT(*)'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Project does not exists"
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

function findProjectStages($project)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT epd.id                 id,
       pr.id                  proyecto,
       p.descripcion          producto,
       pp.cantidad            cantidad,
       pp.instrucciones       instrucciones,
       pin.instalable         instalable,
       u.nombre               responsable,
       ep.etapa               etapa,
       esp.estado             estado,
       epd.fecha_inicio       fecha_inicio,
       epd.fecha_finalizacion fin
    FROM   etapas_proyecto_det epd
        INNER JOIN productos_proyectos pp
                ON epd.fk_producto_proyecto = pp.id
        INNER JOIN productos p
                ON pp.fk_producto = p.id
        INNER JOIN proyectos pr
                ON pp.fk_proyecto = pr.id
        INNER JOIN productos_instalable pin
                ON pp.instalable = pin.id
        INNER JOIN usuarios u
                ON epd.fk_responsable = u.id
        INNER JOIN etapas_proyecto ep
                ON epd.fk_etapa_proyecto = ep.id
        INNER JOIN estados_proyecto esp
                ON epd.fk_estado_etapa = esp.id
    WHERE  pp.fk_proyecto = ?
    ORDER  BY p.descripcion,
            ep.id ";

        $sth = $pdo->prepare($sql);

        $sth->execute([$project]);

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Este proyecto no tiene etapas asignadas"
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
                break;

            case 'update':
                updateProject(
                    $_POST['id'],
                    $_POST['category'],
                    $_POST['customer'],
                    $_POST['value'],
                    $_POST['valuePaid'],
                    $_POST['observations'],
                    $_POST['beginDate'],
                    $_POST['finishDate'],
                    $_POST['status'],
                    $_POST['paymentStatus']
                );
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
                findProjects();
                break;

            case 'id':
                findProjectById($_GET['id']);
                break;

            case 'uuid':
                findProjectByUuid($_GET['uuid']);
                break;

            case 'category':
                findProjectByCategory($_GET['category']);
                break;

            case 'customer':
                findProjectByCustomer($_GET['customer']);
                break;

            case 'responsible':
                findProjectsByResponsible($_GET['responsible']);
                break;

            case 'lastProject_responsible':
                findLastProjectByResponsible($_GET['responsible']);
                break;

            case 'beginDate':
                findProjectByBeginDate($_GET['beginDate']);
                break;

            case 'finishDate':
                findProjectByfinishDate($_GET['finishDate']);
                break;

            case 'status':
                findProjectByStatus($_GET['status']);
                break;

            case 'stages':
                findProjectStages($_GET['project']);
                break;

            case 'creationDate':
                findProjectByCreationDate($_GET['creationDate']);
                break;

            case 'allScheduled':
                fetchAllScheduled();
                break;

            case 'allActive':
                fetchAllActive();
                break;

            case 'allDelayed':
                fetchAllDelayed();
                break;

            case 'allCanceled':
                fetchAllCanceled();
                break;

            case 'count_allScheduled':
                countAllScheduled();
                break;

            case 'count_allActive':
                countAllActive();
                break;

            case 'count_allDelayed':
                countAllDelayed();
                break;

            case 'count_allCanceled':
                countAllCanceled();
                break;


            case 'count_scheduledByResponsible':
                countScheduledByResponsible($_GET['responsible']);
                break;

            case 'count_activeByResponsible':
                countActiveByResponsible($_GET['responsible']);
                break;

            case 'count_delayedByResponsible':
                countDelayedByResponsible($_GET['responsible']);
                break;

            case 'count_canceledByResponsible':
                countCanceledByResponsible($_GET['responsible']);
                break;

            case 'count_reprocessingByResponsible':
                countReprocessingByResponsible($_GET['responsible']);
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
