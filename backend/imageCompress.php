<?php

// function compressImage($source_image, $compress_image)
// {
//     $image_info = getimagesize($source_image);
//     if ($image_info['mime'] == 'image/jpeg' || $image_info['mime'] == 'image/jpg') {
//         $source_image = imagecreatefromjpeg($source_image);
//         return imagejpeg($source_image, $compress_image, 25);             //for jpeg or gif, it should be 0-100 
//     } elseif ($image_info['mime'] == 'image/png') {
//         imagecreatefrompng($source_image);
//         return imagepng($source_image, $compress_image, 3);
//     } else {
//         return imagecreatefromstring(file_get_contents($source_image));
//     }
// }

function compressImage($source_image, $compress_image)
{
    $image_info = getimagesize($source_image);
    if ($image_info['mime'] == 'image/jpeg' || $image_info['mime'] == 'image/jpg') {
        $image = imagecreatefromjpeg($source_image);
        return imagejpeg($image, $compress_image, 25);             //for jpeg or gif, it should be 0-100 
    } elseif ($image_info['mime'] == 'image/png') {
        $image = imagecreatefrompng($source_image);
        return imagejpeg($image, $compress_image, 25);
    } else {
        return imagecreatefromstring(file_get_contents($source_image));
    }
}
