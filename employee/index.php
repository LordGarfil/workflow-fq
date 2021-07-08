<?php
session_start();

if (!isset($_SESSION['user'])) {
  header("Location: ../views/login.php");
  return;
} else {
  if (!isset($_SESSION['rol']) || $_SESSION['rol'] < 2 ||  $_SESSION['rol'] > 4) {
    header("Location: ../views/login.php");
    return;
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="../static/favicon.ico" type="image/x-icon">
  <link rel="icon" href="../static/favicon.ico" type="image/x-icon">

  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
  <link rel="stylesheet" href="../static/styles/styles.css">
  <link rel="stylesheet" href="../static/styles/sb-admin-2.css">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">

  <link rel="stylesheet" type="text/css" href="../static/DataTables/datatables.css" />

  <title>Workflow</title>
</head>

<body>

  <span id="spanUserId" hidden><?php print($_SESSION['userId']) ?></span>

  <div id="wrapper">

    <nav class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <?php include './components/side-nav.php' ?>
    </nav>

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <?php include './components/top-nav.php' ?>
        </nav>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid" id="content-views">

        </div>
        <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

    </div>
    <!-- End of Content Wrapper -->

  </div>

  <div id="overlay">

  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://kit.fontawesome.com/a069d98fa0.js" crossorigin="anonymous"></script>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>

  <script type="text/javascript" src="../static/DataTables/datatables.js"></script>
  <script src="http://momentjs.com/downloads/moment.min.js"></script>

  <script src="../animationsApp.js"></script>
  <script type="module" src="./controllers/app.js" type="module"></script>

</body>

</html>