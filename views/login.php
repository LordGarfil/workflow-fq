<?php
  session_start();
  
    if(isset($_SESSION['user'], $_SESSION['rol'])){
    if($_SESSION['rol'] == 1){
      header("Location: ../admin/index.php");
    }else if($_SESSION['rol'] == 2){
      header("Location: ../employee/index.php");
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
    
    
    <title>Inicio de Sesión</title>
</head>
<body>
    <div id="login-root">
        <div>
        <div class="card shadow d-block">
            <!-- Card Header - Dropdown -->
            <div class="card-header">
              <h3 class="font-weight-bold text-primary">Inicio de Sesión</h3>
            </div>
            <!-- Card Body -->
            <div class="card-body">
              <form method="post" id='loginForm'>
                  <input type="email" placeholder="Usuario" class="form-control input-card" name="user" id="loginEmail" required>
                  <input type="password" placeholder="Contraseña" class="form-control input-card" name="pass" id="loginPassword" required>
                  <input type="submit" value="Iniciar Sesión" class="btn btn-primary form-control">
              </form>
          </div>
          <div class="card-footer">
              <a href="./passwordRecover.php">Recuperar contraseña</a>
              </div>
            </div>
          <div class="alert alert-warning" role="alert" id="loginAlert" hidden>
            ¡Usuario o contraseña incorrecta!
          </div></div>
    </div>
</body>
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="../js/login.js" type="module"></script>
</html>