<?php

$db = "mysql:host=localhost;dbname=fotoquintero_test";
$user = "root";
$password = "";
try {

    $pdo = new PDO($db, $user, $password);
   
} catch (PDOException $e) {
    print "¡Error!: " . $e->getMessage() . "<br/>";
    die();
}
