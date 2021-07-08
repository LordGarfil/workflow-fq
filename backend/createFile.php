<?php

function createImage()
{

    require_once('imageCompress.php');

    $fileName = $_FILES['image']['name'];

    if (str_contains($fileName, '.png')) {
        $fileName = substr($fileName, 0, strpos($fileName, ".")) . '.png';
    } else {
        $fileName = substr($fileName, 0, strpos($fileName, ".")) . '.jpg';
    }
    $fileName = str_replace(' ', '', $fileName);
    $tempName = $_FILES['image']['tmp_name'];
    $folder = "../static/img/activities/";
    $imageName = $folder . $fileName;
    move_uploaded_file($tempName, $imageName);

    // De esta manera una imagen nunca se repite
    $noExtensionFileName = strtr($fileName, ".", true);
    $compress_file = date("Y-m-d") . "-" . date("h-i-sa") . "_" . $fileName;
    $compressed_img = $folder . $compress_file;
    $compress_image = compressImage($imageName, $compressed_img);
    unlink($imageName);            //delete original file

    print_r(json_encode($compress_file));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    createImage();
}
