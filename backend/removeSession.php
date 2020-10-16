<?php
    session_start();
    session_unset();
    header("Location: ../views/login.php");
    return;