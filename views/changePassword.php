<?php
 if ($_SERVER['REQUEST_METHOD'] == 'GET'){
  
    if(isset($_GET['userId']) && isset($_GET['token'])){
      
      try{
        session_start();
        require_once("../backend/dbConection.php");

        $_SESSION['tempId'] = $_GET['userId'];

        $sql = "SELECT peticion_contrasena, token_contrasena from usuarios where id = ?";
        $sth = $pdo->prepare($sql);
        $sth->execute(array($_GET['userId']));

        if ($userRes = $sth->fetch(PDO::FETCH_ASSOC)) {
            if($userRes['peticion_contrasena'] != 1 || $userRes['token_contrasena'] != $_GET['token']){
              header("Location: ../views/404.php");
            }
        } else {
              header("Location: ../views/404.php");
        }
    }catch (PDOException $e) {
        $error = array([
            'error' => 'true',
            'message' => $e->getMessage()
        ]);
        print(json_encode($error[0]));
    }

    }else{
      header("Location: ../views/404.php");
    }
 }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../static/favicon.ico" type="image/x-icon">
    <link rel="icon" href="../static/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="../static/styles/styles.css">
    <link rel="stylesheet" href="../static/styles/sb-admin-2.css"> 
    
    
    <title>Cambiar contraseña</title>
</head>
<body>
    <div id="login-root">
        <div>
        <div class="card shadow d-block">
            <!-- Card Header - Dropdown -->
            <div class="card-header">
              <h3 class="font-weight-bold text-primary">Cambiar contraseña</h3>
            </div>
            <!-- Card Body -->
            <div class="card-body">
              <form method="post" id='changePasswordForm'>
                  <input type="password" placeholder="Nueva contraseña" class="form-control input-card" name="newPassword" id="newPassword" required>
                  <input type="password" placeholder="Confirmar contraseña" class="form-control input-card" name="newConfirmedPassword" id="newConfirmedPassword" required>
                  <input type="submit" value="Modificar" class="btn btn-primary form-control">
              </form> 
          </div>
            </div>
          <div class="alert alert-warning" role="alert" id="changePasswordAlert" hidden>
          </div></div>
    </div>
</body>
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="../js/changePassword.js" type="module"></script>
</html>