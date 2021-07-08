<?php
  session_start();
    if(isset($_SESSION['user'], $_SESSION['rol'])){
    if($_SESSION['rol'] == 1){
      header("Location: ./admin/index.php");
    }else if($_SESSION['rol'] == 2){
      header("Location: ./employee/index.php");
    }
  }else{ 
    header("Location: ./views/login.php");
    return;
  }
