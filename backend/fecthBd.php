<?php

function getTableData($tableName){
   
        require_once("dbConection.php");
      
        $sql = "SELECT * FROM $tableName";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    
}

function getSpecificData($sql){
    
        require_once("dbConection.php");
      
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    
}

if ($_SERVER['REQUEST_METHOD'] == 'GET'){

    if($_GET['type'] == 1){
        getTableData($_GET['table']);
    }else if($_GET['type'] == 2){
        getSpecificData($_GET['sql']);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

    if($_POST['type'] == 1){
        getTableData($_POST['table']);
    }else if($_POST['type'] == 2){
        getSpecificData($_POST['sql']);
    }
}