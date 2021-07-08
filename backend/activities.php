<?php

function addActivity($project, $projectStage, $product, $imageSrc, $responsable, $comments)
{
    try {

        require_once("dbConection.php");

        $sql = ("INSERT INTO actividades (fk_proyecto, fk_etapa_proyecto, fk_producto, imagen, fk_responsable, fk_estado_actividad, comentarios)
         VALUES (?,?,?,?,?,?,?)");

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$project, $projectStage, $product, $imageSrc, $responsable, 1, $comments]);

        $resStatus = array([
            'success' => 'true',
            'message' => "Activity successfully added"
        ]);
        print(json_encode($resStatus[0]));
    } catch (PDOException $e) {
        $resStatus = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($resStatus[0]));
    }
}

function updateActivity($id, $image, $comments)
{
    try {

        require_once("dbConection.php");

        if ($image != null) {
            $sql = ("UPDATE actividades SET imagen = ?, comentarios = ?, fecha_ultima_actualizacion = ? WHERE id = ?");

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $image, $comments, date("Y-m-d") . "-" . date("h-i-sa"), $id
            ]);
        } else {
            $sql = ("UPDATE actividades SET comentarios = ?, fecha_ultima_actualizacion = ? WHERE id = ?");

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $comments, date("Y-m-d") . "-" . date("h-i-sa"), $id
            ]);
        }

        $sql2 = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id and
                        actividades.id = ?";
        $sth2 = $pdo->prepare($sql2);
        $sth2->execute(array($id));

        $res = array();
        if ($resRow = $sth2->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            print(json_encode(($res[0])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
            ]);
            print(json_encode($error[0]));
        }
    } catch (PDOException $e) {
        $resStatus = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($resStatus[0]));
    }
}

function deleteActivity($id)
{
    try {

        require_once("dbConection.php");

        $sql = ("UPDATE actividades SET fk_estado_actividad = ? WHERE id = ?");

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            2, $id
        ]);


        $sql2 = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id and
                        actividades.id = ?";
        $sth2 = $pdo->prepare($sql2);
        $sth2->execute(array($id));

        $res = array();
        if ($resRow = $sth2->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            print(json_encode(($res[0])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
            ]);
            print(json_encode($error[0]));
        }
    } catch (PDOException $e) {
        $resStatus = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($resStatus[0]));
    }
}

function findAll()
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id order by etapas_proyecto.etapa, fecha";
        $sth = $pdo->prepare($sql);
        $sth->execute(array());

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
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

function findAllActive()
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id and fk_estado_actividad = ? 
                        order by etapas_proyecto.etapa, fecha";
        $sth = $pdo->prepare($sql);
        $sth->execute(array(1));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
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

function findByProjectId_All($projectId)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id AND fk_proyecto = ? order by etapas_proyecto.etapa, fecha";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($projectId));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
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

function findByProjectId_Active($projectId)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id AND fk_estado_actividad = ? AND
                         fk_proyecto = ? order by etapas_proyecto.etapa, fecha";
        $sth = $pdo->prepare($sql);
        $sth->execute(array(1, $projectId));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
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

function findByProductResponsable_all($project, $stage, $product, $responsible)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, fk_producto, imagen, fk_responsable, fecha, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
        FROM actividades, etapas_proyecto WHERE
                fk_etapa_proyecto = etapas_proyecto.id and
                fk_proyecto = ? and fk_etapa_proyecto = ? and fk_producto = ? and fk_responsable = ? order by fecha ASC";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($project, $stage, $product, $responsible));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities added"
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

function findByProductResponsable_active($project, $stage, $product, $responsible)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, fk_producto, imagen, fk_responsable, fecha, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
        FROM actividades, etapas_proyecto WHERE
                fk_etapa_proyecto = etapas_proyecto.id and
                fk_proyecto = ? and fk_etapa_proyecto = ? and fk_producto = ? and fk_responsable = ? and fk_estado_actividad = ?
                 order by fecha ASC";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($project, $stage, $product, $responsible, 1));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities added"
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

function findByLastProductResponsable($project, $stage, $product, $responsible)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, fk_producto, productos.descripcion as producto,
        imagen, fk_responsable, fecha, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
        FROM actividades, etapas_proyecto, productos WHERE
                fk_etapa_proyecto = etapas_proyecto.id and
                productos.id = actividades.fk_producto and
                fk_proyecto = ? and fk_etapa_proyecto = ? and fk_producto = ? and fk_responsable = ? order by fecha DESC LIMIT 1";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($project, $stage, $product, $responsible));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            while ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
                array_push($res, $resRow);
            }
            print(json_encode(($res)));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities added"
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

function findById($id)
{
    try {

        require_once("dbConection.php");

        $sql = "SELECT actividades.id, fk_proyecto, etapas_proyecto.etapa as etapa, fk_etapa_proyecto, productos.descripcion as producto, fk_producto, imagen,
        usuarios.nombre as responsable, fk_responsable, fecha, estados_situacion.estado as estado, fk_estado_actividad, fecha_ultima_actualizacion, comentarios
                FROM actividades, etapas_proyecto, productos, usuarios, estados_situacion WHERE
                        fk_etapa_proyecto = etapas_proyecto.id and
                        fk_producto = productos.id and
                        fk_responsable = usuarios.id and
                        fk_estado_actividad = estados_situacion.id and
                        actividades.id = ?";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($id));

        $res = array();
        if ($resRow = $sth->fetch(PDO::FETCH_ASSOC)) {
            array_push($res, $resRow);
            print(json_encode(($res[0])));
        } else {
            $error = array([
                'error' => 'true',
                'message' => "No activities found"
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

    switch ($_GET['filterBy']) {

        case 'all':
            findAll();
            break;

        case 'allActive':
            findAllActive();
            break;

        case 'projectId':
            findByProjectId_All($_GET['projectId']);
            break;

        case 'projectId_active':
            findByProjectId_Active($_GET['projectId']);
            break;

        case 'productResponsible_all':
            findByProductResponsable_all($_GET['project'], $_GET['stage'], $_GET['product'], $_GET['responsible']);
            break;

        case 'productResponsible_active':
            findByProductResponsable_active($_GET['project'], $_GET['stage'], $_GET['product'], $_GET['responsible']);
            break;

        case 'lastProductResponsible':
            findByLastProductResponsable($_GET['project'], $_GET['stage'], $_GET['product'], $_GET['responsible']);
            break;

        case 'id':
            findById($_GET['id']);
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    switch ($_POST['action']) {

        case 'add':
            addActivity($_POST['project'], $_POST['stage'], $_POST['product'], $_POST['image'], $_POST['responsible'], $_POST['comments']);
            break;

        case 'update':
            updateActivity($_POST['id'], $_POST['image'], $_POST['comments']);
            break;

        case 'delete':
            deleteActivity($_POST['id']);
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
