<?php

namespace App\Service;

use Symfony\Component\Uid\Uuid;

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

class ImageManager
{
    private string $imageFolder;

    public function __construct(string $imageFolder) {
        $this->imageFolder = $imageFolder;
    }

    public function saveBase64ImageInSupportedFormat(string $base64_image) : string | null{
        $decodedImage = base64_decode($base64_image);

        if ($decodedImage === false) {
            return null;
        }

        // Parse image metadata to check if image extension/format is supported
        $info = getimagesizefromstring($decodedImage);
        $extension = image_type_to_extension($info[2]);

        if (!in_array($extension, SUPPORTED_EXTENSIONS)){
            return null;
        }

        $image = imagecreatefromstring($decodedImage);

        $filename = $this->getImageFilePath($extension);

        $filepath = "$this->imageFolder/$filename";

        $result = match($extension) {
            ".jpg", ".jpeg" => imageJpeg($image, $filepath, 85),
            ".png"          => imagepng($image, $filepath, 6),
            ".webp"         => imagewebp($image, $filepath, 85),
            default         => false,
        };

        if (!$result){
            return null;
        }

        return $filename;
    }

    public function deleteImage(string $imageName) : bool{
        return unlink(filename: "$this->imageFolder/$imageName");
    }

    private function getImageFilePath(string $extension): string{
        $filename = Uuid::v4()->toRfc4122(). "$extension";
        return $filename;
    }
}