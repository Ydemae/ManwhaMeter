<?php

namespace App\Service;

use Symfony\Component\Uid\Uuid;


class ImageManager
{
    private string $imageFolder;

    public function __construct(string $imageFolder = null) {
        $this->imageFolder = $imageFolder;
    }

    public function saveBase64ImageInJpegFormat(string $base64_image) : string | null{
        $decodedImage = base64_decode($base64_image);

        if ($decodedImage === false) {
            return null;
        }

        $image = imagecreatefromstring($decodedImage);

        $filename = $this->getImageFilePath();

        $filepath = "$this->imageFolder/$filename";

        $result = imagejpeg($image, $filepath, 70);
        
        imagedestroy($image);

        if (!$result){
            return null;
        }

        return $filename;
    }

    public function deleteImage(string $imageName) : bool{
        return unlink(filename: "$this->imageFolder/$imageName");
    }

    private function getImageFilePath(): string{
        $filename = Uuid::v4()->toRfc4122().".jpg";
        return $filename;
    }
}