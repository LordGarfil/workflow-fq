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

function getStatusesProject(){
    require_once("dbConection.php");
      
        $sql = "SELECT id, estado as status FROM estados_proyecto";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getPaymentStatuses(){
    require_once("dbConection.php");
      
        $sql = "SELECT id, estado as status FROM estados_pago";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getTyperPerson(){
    require_once("dbConection.php");
      
        $sql = "SELECT id, tipo as type from tipos_persona";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET'){

    if(isset($_GET['search'])){
        switch ($_GET['search']) {
            case 'status':
                getStatusesProject();
                break;

            case 'paymentStatus':
                getPaymentStatuses();
                break;
                
            case 'typePerson':
                getTyperPerson();
                break;
            
            default:
            $error = array([
                'error' => 'true',
                'message' => "This route does not exist"
            ]);
            print(json_encode($error[0]));
            break;
        }
    }else if(isset($_GET['type'])){
        switch ($_GET['type']) {
            case 1:
                getTableData($_GET['table']);
                break;

                case 2:
                    getSpecificData($_GET['sql']);
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

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

    if($_POST['type'] == 1){
        getTableData($_POST['table']);
    }else if($_POST['type'] == 2){
        getSpecificData($_POST['sql']);
    }
}