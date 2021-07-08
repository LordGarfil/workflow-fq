<?php

function addProductStage($projectId, $stage, $stageStatus, $productId, $responsible)
{
    try {
        require_once("dbConection.php");

        $sqlProductprojectId = "SELECT pp.id id
                    FROM   productos_proyectos pp
                    WHERE  fk_proyecto = $projectId
                        AND fk_producto = $productId ";

        $stmtProductprojectId = $pdo->prepare($sqlProductprojectId);
        $stmtProductprojectId->execute();
        $resProductproject = $stmtProductprojectId->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

        $sql = "CALL asignProjectStage(?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        $stmt->execute([$resProductproject, $stage, $stageStatus, $responsible]);

        $newStageSql = "SELECT epd.id           id,
       p.descripcion    producto,
       ep.etapa         etapa,
       ee.estado        estado,
       u.nombre         responsable,
       epd.fecha_inicio fecha_inicio
        FROM   etapas_proyecto_det epd
            INNER JOIN productos p
                    ON epd.fk_producto_proyecto = p.id
            INNER JOIN etapas_proyecto ep
                    ON epd.fk_etapa_proyecto = ep.id
            INNER JOIN estados_proyecto ee
                    ON epd.fk_estado_etapa = ee.id
            INNER JOIN usuarios u
                    ON epd.fk_responsable = u.id
        ORDER  BY epd.id DESC
        LIMIT  1 ";
        $stmtNewStage = $pdo->prepare($newStageSql);
        $stmtNewStage->execute();
        $resNewStage = $stmtNewStage->fetchAll(PDO::FETCH_ASSOC);
        print_r(json_encode(($resNewStage)));
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function updateProductStage($id, $status, $responsible)
{
    try {
        require_once("dbConection.php");

        $sql;

        if ($status && !$responsible) {
            $sql = "UPDATE etapas_proyecto_det SET fk_estado_etapa = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$status, $id]);
        } else if ($responsible && !$status) {
            $sql = "UPDATE etapas_proyecto_det SET fk_responsable = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$responsible, $id]);
        } else {
            $sql = "UPDATE etapas_proyecto_det SET fk_estado_etapa = ?, fk_responsable = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$status, $responsible, $id]);
        }
        print_r(json_encode('Success'));
    } catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }
}

function findProjectStages()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT * FROM etapas_proyecto ep";

        $sth = $pdo->prepare($sql);

        $sth->execute();

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "NO hay etapas asignadas"
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

function findStageStatus()
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT * FROM estados_etapas";

        $sth = $pdo->prepare($sql);

        $sth->execute();

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Esta etapa no existe"
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

function findProductStageById($project)
{
    try {
        require_once("dbConection.php");

        $sql = "select epd.id id, pr.id proyecto, p.descripcion producto, pp.cantidad cantidad,
            pp.instrucciones instrucciones, pin.instalable instalable, u.nombre responsable,
            ep.etapa etapa, esp.estado estado, epd.fecha_inicio fecha_inicio, epd.fecha_finalizacion fin
            from etapas_proyecto_det epd  
            inner join productos_proyectos pp on epd.fk_producto_proyecto = pp.id
            inner join productos p on pp.fk_producto = p.id 
            inner join proyectos pr on pp.fk_proyecto = pr.id 
            inner join productos_instalable pin on pp.instalable = pin.id 
            inner join usuarios u on epd.fk_responsable = u.id
            inner join etapas_proyecto ep on epd.fk_etapa_proyecto = ep.id 
            inner join estados_proyecto esp on epd.fk_estado_etapa = esp.id
            where epd.id = ?
            order by p.descripcion";

        $sth = $pdo->prepare($sql);

        $sth->execute([$project]);

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes[0])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Esta etapa no existe"
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

function findStagesFromProductsProject($project, $product)
{
    try {
        require_once("dbConection.php");

        $sql = "SELECT DISTINCT epd.fk_etapa_proyecto id,
                        ep.etapa              etapa
        FROM   etapas_proyecto_det epd
            INNER JOIN etapas_proyecto ep
                    ON epd.fk_etapa_proyecto = ep.id
            INNER JOIN productos_proyectos pp
                    ON epd.fk_producto_proyecto = pp.id
        WHERE  pp.fk_proyecto = ?
            AND pp.fk_producto = ?
            order by ep.id";

        $sth = $pdo->prepare($sql);

        $sth->execute(array($project, $product));

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Este projecto no tiene etapas"
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

function findProductsStageAvailable()
{
    try {
        require_once("dbConection.php");
        session_start();

        $sql = "SELECT DISTINCT epd.id id,
                pr.id proyecto,
                p.descripcion producto,
                pp.cantidad cantidad,
                pp.instrucciones instrucciones,
                pin.instalable instalable,
                ep.etapa etapa,
                epd.fecha_inicio fecha_inicio,
                epd.fecha_finalizacion fin
                FROM etapas_proyecto_det epd
                INNER JOIN productos_proyectos pp ON epd.fk_producto_proyecto = pp.id
                INNER JOIN productos p ON pp.fk_producto = p.id
                INNER JOIN proyectos pr ON pp.fk_proyecto = pr.id
                INNER JOIN productos_instalable pin ON pp.instalable = pin.id
                INNER JOIN etapas_proyecto ep ON epd.fk_etapa_proyecto = ep.id
                INNER JOIN roles_etapas re ON ep.id = re.etapa_id
                WHERE epd.fk_estado_etapa = ?
                AND epd.fk_responsable = ?
                AND re.rol_id = ?
                ORDER BY p.descripcion";

        $sth = $pdo->prepare($sql);

        $sth->execute([1, 3, $_SESSION['rol']]);

        if ($projectRes = $sth->fetchAll(PDO::FETCH_ASSOC)) {
            print(json_encode(($projectRes)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "Esta etapa no existe"
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

            case 'add':
                addProductStage(
                    $_POST['project'],
                    $_POST['stage'],
                    $_POST['stageStatus'],
                    $_POST['product'],
                    $_POST['responsible']
                );
                break;

            case 'update':
                updateProductStage(
                    $_POST['id'],
                    $_POST['status'],
                    $_POST['responsible']
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

            case 'projectStages':
                findProjectStages();
                break;

            case 'stageStatus':
                findStageStatus();
                break;

            case 'id':
                findProductStageById($_GET['id']);
                break;

            case 'available':
                findProductsStageAvailable();
                break;

            case 'fromProductsProject':
                findStagesFromProductsProject(
                    $_GET['project'],
                    $_GET['product']
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
    } else {
        $error = array([
            'error' => 'true',
            'message' => "This route does not exist"
        ]);
        print(json_encode($error[0]));
        return;
    }
}
