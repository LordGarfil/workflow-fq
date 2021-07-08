<?php

function updateImage()
{
    require_once('imageCompress.php');

    unlink($_POST['previousImage']);

    $fileName = $_FILES['image']['name'];
    $tempName = $_FILES['image']['tmp_name'];
    $folder = "../static/img/activities/";
    $imageName = $folder . $fileName;
    move_uploaded_file($tempName, $imageName);

    // $compress_file="_".$fileName;      
    // De esta manera una imagen nunca se repite
    $noExtensionFileName = strtr($fileName, ".", true);
    $compress_file = date("Y-m-d") . "-" . date("h-i-sa") . "_" . $noExtensionFileName . '.jpg';
    $compressed_img = $folder . $compress_file;
    $compress_image = compressImage($imageName, $compressed_img);
    unlink($imageName);

    print_r(json_encode($compress_file));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    updateImage();
}
