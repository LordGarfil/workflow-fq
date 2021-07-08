<?php

function addProductsProject($projectId, $productId, $quantity, $instructions, $installable, $address, $status, $responsibleRecep, $responsible, $stage)
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
            "address" => $address,
            "status" => $status,
            "responsible" => $responsible,
            "stage" => $stage
        ];

        $sql = ("INSERT INTO productos_proyectos (fk_proyecto, fk_producto, cantidad, instrucciones, instalable,
             direccion, fk_estado)
              VALUES (:projectId, :productId, :quantity, :instructions, :installable, :address, :status)");

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            'projectId' => $product['projectId'], 'productId' => $product['productId'], 'quantity' => $product['quantity'],
            'instructions' => $product['instructions'], 'installable' => $product['installable'],
            'address' => $product['address'], 'status' => $status
        ]);

        $sqlLastPp = "SELECT id
            FROM productos_proyectos
           ORDER BY id DESC
           LIMIT 1";

        $stmtLastPp = $pdo->prepare($sqlLastPp);
        $stmtLastPp->execute();
        $lastPp = $stmtLastPp->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

        // Asigna la etapa de recepcion
        $sql2 = "CALL asignProjectStage(?, ?, ?, ?)";
        $stmt2 = $pdo->prepare($sql2);

        $stmt2->execute([$lastPp, 1, 3, $responsibleRecep]);

        // Asigna la etapa seleccionada por recepcion
        $sql3 = "CALL asignProjectStage(?, ?, ?, ?)";
        $stmt3 = $pdo->prepare($sql3);

        $responsible = $product['responsible'] ? $product['responsible'] : 3;

        $stmt3->execute([$lastPp, $product['stage'], $product['status'], $responsible]);

        print_r(json_encode($product));
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function updateProductsProject($action, $projectId, $productProjectId, $product, $quantity, $instructions, $installable, $address, $asignationStatus)
{
    try {
        require_once("dbConection.php");
        if ($action == 'create') {

            if ($asignationStatus == 1) {
                $sql = ("INSERT INTO productos_proyectos (fk_proyecto, fk_producto, cantidad, instrucciones, instalable,
             direccion, fk_responsable, fk_estado_asignacion, fk_estado)
              VALUES (:projectId, :productId, :quantity, :instructions, :installable, :address, :asignationStatus, :status)");

                $stmt = $pdo->prepare($sql);

                $stmt->execute([
                    'projectId' => $product['projectId'], 'productId' => $product['productId'], 'quantity' => $product['quantity'],
                    'instructions' => $product['instructions'], 'installable' => $product['installable'],
                    'address' => $product['address'], 'asignationStatus' => $asignationStatus,
                    'status' => 1
                ]);
            } else if ($asignationStatus == 2) {
                $sql = ("INSERT INTO productos_proyectos (fk_proyecto, fk_producto, cantidad, instrucciones, instalable,
             direccion, fk_estado_asignacion, fk_estado)
              VALUES (:projectId, :productId, :quantity, :instructions, :installable, :address, :asignationStatus, :status)");

                $stmt = $pdo->prepare($sql);

                $stmt->execute([
                    'projectId' => $product['projectId'], 'productId' => $product['productId'], 'quantity' => $product['quantity'],
                    'instructions' => $product['instructions'], 'installable' => $product['installable'],
                    'address' => $product['address'], 'asignationStatus' => $asignationStatus,
                    'status' => 1
                ]);
            }

            print(json_encode(array([
                "project" => $projectId,
                "product" => $product,
                "quantity" => $quantity,
                "instructions" => $instructions,
                "installable" => $installable,
                "address" => $address,
                "asignationStatus" => $asignationStatus,
                "status" => 1
            ])));
        } else if ($action == 'update') {


            $sql = ("UPDATE productos_proyectos SET fk_producto = ?, cantidad = ?, instrucciones = ?,
            instalable = ?, direccion = ? where id = ?");

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $product, $quantity, $instructions, $installable, $address, $productProjectId
            ]);

            print(json_encode(array([
                "project" => $projectId,
                "productProject" => $productProjectId,
                "product" => $product,
                "quantity" => $quantity,
                "instructions" => $instructions,
                "installable" => $installable,
                "address" => $address
            ])));
        }
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function findProductsProject()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT productos_proyectos.id, proyectos.id as project, productos.descripcion as name,
        productos_proyectos.cantidad as quantity, productos_proyectos.instrucciones as instructions,
         productos_instalable.instalable as installable , productos_proyectos.direccion as address, estados_proyecto.estado as status 
         from productos_proyectos, proyectos, productos, productos_instalable, estados_proyecto, estados_asignacion
       where productos.id = fk_producto  and proyectos.id = fk_proyecto
       and productos_instalable.id = productos_proyectos.instalable AND estados_proyecto.id = fk_estado order by productos_proyectos.id";

        $sth = $pdo->prepare($sql);
        $sth->execute(array());
        $productsProject = array();
        if ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($productsProject, $productRow);
            while ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($productsProject, $productRow);
            }
            print(json_encode(($productsProject)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Este proyecto no tiene productos asociados"
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



function findProductsProjectById($id, $responsible)
{
    try {
        require_once("dbConection.php");
        session_start();

        $sql = "SELECT productos_proyectos.id, proyectos.id as asd, usuarios.nombre as responsable, productos.descripcion, cantidad, instrucciones, productos_instalable.instalable, direccion,
            estados_proyecto.estado, productos_proyectos.fecha_asignacion, productos_proyectos.fecha_finalizacion
            FROM productos_proyectos, proyectos, productos, estados_proyecto, productos_instalable, usuarios
            WHERE 
            fk_proyecto = proyectos.id AND
            fk_producto = productos.id AND
            productos_proyectos.instalable = productos_instalable.id AND
            fk_estado = estados_proyecto.id AND
            productos_proyectos.fk_responsable = usuarios.id AND
            productos_proyectos.id = ? AND
            productos_proyectos.fk_responsable = ?
             ORDER by proyectos.id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($id, $responsible));
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($res) {
            print_r(json_encode($res[0]));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No projects found"
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

function findProductsProjectByProject($project)
{
    try {
        require_once("dbConection.php");

        // $sql = "CALL findProductsProjectByProject(?)";
        $sql = "SELECT
        productos_proyectos.id,
        proyectos.id as project,
        productos.descripcion as name,
        productos.id as productId,
        productos_proyectos.cantidad as quantity,
        productos_proyectos.instrucciones as instructions,
        productos_instalable.instalable as installable,
        productos_proyectos.direccion as address,
        estados_proyecto.estado as status
      from
        productos_proyectos,
        proyectos,
        productos,
        productos_instalable,
        estados_proyecto
      where
        productos.id = fk_producto
        and proyectos.id = fk_proyecto
        and productos_instalable.id = productos_proyectos.instalable
        AND estados_proyecto.id = fk_estado
        and productos_proyectos.fk_proyecto = ?
      order by
        productos_proyectos.id";
        // $sql = "select * from productos_proyectos where fk_proyecto in (SELECT id from proyectos where id = ?)";

        $sth = $pdo->prepare($sql);
        $sth->execute(array($project));
        $productsProject = array();
        if ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($productsProject, $productRow);
            while ($productRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($productsProject, $productRow);
            }
            print(json_encode(($productsProject)));
            // print(json_encode(($productsProject[0]['id'])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Este proyecto no tiene productos asociados"
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

function findProductsProjectByProduct($product)
{
}

function findProductsProjectByResponsible($responsible)
{
    try {
        require_once("dbConection.php");
        session_start();

        $sql = "SELECT epd.id id,
                pp.fk_proyecto proyecto,
                pp.fk_producto productoId,
                p.descripcion descripcion,
                epd.fk_etapa_proyecto etapaId,
                ep.etapa etapa,
                epd.fk_estado_etapa estadoId,
                ee.estado estado,
                pp.cantidad cantidad,
                pp.instrucciones instrucciones,
                i.instalable instalable,
                pp.direccion direccion,
                epd.fecha_inicio fecha_inicio,
                epd.fecha_finalizacion fecha_finalizacion
            FROM productos_proyectos pp
            INNER JOIN etapas_proyecto_det epd ON pp.id = epd.fk_producto_proyecto
            INNER JOIN productos p ON pp.fk_producto = p.id
            INNER JOIN etapas_proyecto ep ON epd.fk_etapa_proyecto = ep.id
            INNER JOIN estados_etapas ee ON epd.fk_estado_etapa = ee.id
            inner join productos_instalable i on pp.instalable = i.id 
            WHERE epd.fk_responsable = ?
             ORDER by pp.fk_proyecto DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($responsible));
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($res) {
            print_r(json_encode($res));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No projects found"
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

function findProductsProjectById_Responsible($id, $responsible)
{
    try {
        require_once("dbConection.php");
        session_start();

        $sql = "SELECT epd.id id,
                pp.fk_proyecto proyecto,
                pp.fk_producto productoId,
                p.descripcion descripcion,
                epd.fk_etapa_proyecto etapaId,
                ep.etapa etapa,
                epd.fk_estado_etapa estadoId,
                ee.estado estado,
                pp.cantidad cantidad,
                pp.instrucciones instrucciones,
                i.instalable instalable,
                pp.direccion direccion,
                epd.fecha_inicio fecha_inicio,
                epd.fecha_finalizacion fecha_finalizacion
            FROM productos_proyectos pp
            INNER JOIN etapas_proyecto_det epd ON pp.id = epd.fk_producto_proyecto
            INNER JOIN productos p ON pp.fk_producto = p.id
            INNER JOIN etapas_proyecto ep ON epd.fk_etapa_proyecto = ep.id
            INNER JOIN estados_etapas ee ON epd.fk_estado_etapa = ee.id
            inner join productos_instalable i on pp.instalable = i.id 
            WHERE epd.id = ? AND
            epd.fk_responsable = ?
            ORDER by pp.fk_proyecto DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($id, $responsible));
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($res) {
            print_r(json_encode($res[0]));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No projects found"
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

function findProductsProjectByCreationDate($creationDate)
{
}

function findNoUnassignedProductsProject()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT * FROM productos_proyectos WHERE fk_responsable is null";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($res) {
            print_r(json_encode($res));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No products project found"
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

function fetchProductsProjectDetails_byResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT
                epd.id id,
                pp.fk_proyecto proyecto,
                pp.fk_producto productoId,
                p.descripcion producto,
                epd.fk_etapa_proyecto etapaId,
                ep.etapa etapa,
                epd.fk_estado_etapa estadoId,
                ee.estado estado,
                epd.fecha_inicio fecha_inicio
                FROM productos_proyectos pp
                INNER JOIN etapas_proyecto_det epd
                ON pp.id = epd.fk_producto_proyecto
                INNER JOIN productos p
                ON pp.fk_producto = p.id
                INNER JOIN etapas_proyecto ep
                ON epd.fk_etapa_proyecto = ep.id
                INNER JOIN estados_etapas ee
                ON epd.fk_estado_etapa = ee.id
                WHERE epd.fk_responsable = 2
                LIMIT 10";

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

function fetchScheduledProductsProject_byResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT
                epd.id id,
                pp.fk_proyecto proyecto,
                pp.fk_producto productoId,
                p.descripcion producto,
                epd.fk_etapa_proyecto etapaId,
                ep.etapa etapa,
                epd.fk_estado_etapa estadoId,
                ee.estado estado,
                pp.cantidad cantidad,
                pp.instrucciones instrucciones,
                pp.instalable instalable,
                epd.fecha_inicio fecha_inicio,
                epd.fecha_finalizacion fecha_finalizacion
                FROM productos_proyectos pp
                INNER JOIN etapas_proyecto_det epd
                ON pp.id = epd.fk_producto_proyecto
                INNER JOIN productos p
                ON pp.fk_producto = p.id
                INNER JOIN etapas_proyecto ep
                ON epd.fk_etapa_proyecto = ep.id
                INNER JOIN estados_etapas ee
                ON epd.fk_estado_etapa = ee.id
                WHERE epd.fk_responsable = ?
                AND epd.fk_estado_etapa = 1";

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

function fetchActiveProductsProject_byResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT
                epd.id id,
                pp.fk_proyecto proyecto,
                pp.fk_producto productoId,
                p.descripcion producto,
                epd.fk_etapa_proyecto etapaId,
                ep.etapa etapa,
                epd.fk_estado_etapa estadoId,
                ee.estado estado,
                pp.cantidad cantidad,
                pp.instrucciones instrucciones,
                pp.instalable instalable,
                epd.fecha_inicio fecha_inicio,
                epd.fecha_finalizacion fecha_finalizacion
                FROM productos_proyectos pp
                INNER JOIN etapas_proyecto_det epd
                ON pp.id = epd.fk_producto_proyecto
                INNER JOIN productos p
                ON pp.fk_producto = p.id
                INNER JOIN etapas_proyecto ep
                ON epd.fk_etapa_proyecto = ep.id
                INNER JOIN estados_etapas ee
                ON epd.fk_estado_etapa = ee.id
                WHERE epd.fk_responsable = ?
                AND epd.fk_estado_etapa = 2";

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

function fetchDelayedProductsProject_byResponsible($responsible)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT epd.id id, pp.fk_proyecto proyecto,
                pp.fk_producto productoid, p.descripcion producto,
                epd.fk_etapa_proyecto etapaid, ep.etapa etapa,
                epd.fk_estado_etapa estadoid, ee.estado estado,
                pp.cantidad cantidad, pp.instrucciones instrucciones,
                pp.instalable instalable,
                pr.fecha_inicio fecha_inicio,
                pr.fecha_finalizacion fecha_finalizacion
                FROM productos_proyectos pp
                INNER JOIN etapas_proyecto_det epd ON pp.id = epd.fk_producto_proyecto
                INNER JOIN productos p ON pp.fk_producto = p.id
                INNER JOIN etapas_proyecto ep ON epd.fk_etapa_proyecto = ep.id
                INNER JOIN estados_etapas ee ON epd.fk_estado_etapa = ee.id
                INNER JOIN proyectos pr ON pp.fk_proyecto = pr.id
                WHERE epd.fk_responsable = ? AND
                epd.fk_estado_etapa BETWEEN 1 AND 2 AND
                pr.fecha_finalizacion < ?";

        $sth = $pdo->prepare($sql);

        $sth->execute(array($responsible, date("Y-m-d")));
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'create':
                addProductsProject(
                    $_POST['projectId'],
                    $_POST['productId'],
                    $_POST['quantity'],
                    $_POST['instructions'],
                    $_POST['installable'],
                    $_POST['address'],
                    $_POST['status'],
                    $_POST['responsibleRecep'],
                    $_POST['responsible'],
                    $_POST['stage'],
                );
                break;

            case 'update':
                updateProductsProject(
                    $_POST['action'],
                    $_POST['projectId'],
                    $_POST['productProjectId'],
                    $_POST['productId'],
                    $_POST['quantity'],
                    $_POST['instructions'],
                    $_POST['installable'],
                    $_POST['address'],
                    $_POST['asignationStatus']
                );
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
                findProductsProject();
                break;

            case 'id':
                findProductsProjectById($_GET['id'], $_GET['responsible']);
                break;

            case 'project':
                findProductsProjectByProject($_GET['project']);
                break;

            case 'product':
                findProductsProjectByProduct($_GET['product']);
                break;

            case 'responsible':
                findProductsProjectByResponsible($_GET['responsible']);
                break;

            case 'id&responsible':
                findProductsProjectById_Responsible($_GET['id'], $_GET['responsible']);
                break;

            case 'creationDate':
                findProductsProjectByCreationDate($_GET['creationDate']);
                break;

            case 'unassigned':
                findNoUnassignedProductsProject();
                break;

            case 'detail_byResponsible':
                fetchProductsProjectDetails_byResponsible($_GET['responsible']);
                break;

            case 'scheduledDetail_byResponsible':
                fetchScheduledProductsProject_byResponsible($_GET['responsible']);
                break;

            case 'activeDetail_byResponsible':
                fetchActiveProductsProject_byResponsible($_GET['responsible']);
                break;

            case 'delayedDetail_byResponsible':
                fetchDelayedProductsProject_byResponsible($_GET['responsible']);
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
