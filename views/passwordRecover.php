<?php
 
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
    
    
    <title>Recuperar contraseña</title>
</head>
<body>
    <div id="login-root">
        <div>
        <div class="card shadow d-block">
            <!-- Card Header - Dropdown -->
            <div class="card-header">
              <h3 class="font-weight-bold text-primary">Recuperar contraseña</h3>
            </div>
            <!-- Card Body -->
            <div class="card-body">
              <form method="post" id='recoverPasswordForm'>
                  <input type="email" placeholder="Email" class="form-control input-card" name="email" id="revoredEmail" required>
                  <input type="submit" value="Enviar" class="btn btn-primary form-control">
              </form> 
          </div>
          <div class="card-footer">
              <a href="./login.php">Iniciar sesión</a>
              </div>
            </div>
          <div class="alert alert-warning" role="alert" id="recoverPasswordAlert" hidden>
            Este correo no existe
          </div></div>
    </div>
</body>
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="../js/recoverPassword.js" type="module"></script>
</html>