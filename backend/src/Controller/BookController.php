<?php

namespace App\Controller;

use App\Entity\Book;
use App\enum\BookStatus;
use App\enum\BookType;
use App\Repository\BookRepository;
use App\Repository\TagRepository;
use App\Service\AuthService;
use App\Service\ImageManager;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use ValueError;

#[Route('/books')]
final class BookController extends AbstractController
{
    #[Route('/getAll', name: 'book_getall', methods: ["POST"])]
    public function getAll(Request $request, BookRepository $bookRepository, SerializerInterface $serializerInterface): Response
    {
        $body = $request->attributes->get("sanitized_body");


        $tags = [];
        if (array_key_exists("tags", $body)){
            $tags = $body["tags"];
        }

        $bookType = null;
        if (array_key_exists("book_type", $body)){
            $bookType = $body["book_type"];

            if ($bookType !== null){
                try {
                    $type = BookType::from($bookType);
                    $bookType = $type->value;
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book type"], 400);
                }
            }
        }
        
        $bookName = "";
        if (array_key_exists("book_name", $body)){
            $bookName = $body["book_name"];
        }

        $status = null;
        if (array_key_exists("status", $body)){
            $status = $body["status"];


            if ($status !== null){
                try {
                    $status = BookStatus::from($status)->value;
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book status"], 400);
                }
            }
        }

        $active = null;
        if (array_key_exists("active", $body)){
            $active = $body["active"];
        }

        $allBooks = $bookRepository->getAllRanked(
            tags: $tags,
            bookType: $bookType,
            bookName: $bookName,
            orderBy: "DESC",
            status: $status,
            active: $active
        );

        $jsonBooks = $serializerInterface->serialize($allBooks, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","books" => json_decode($jsonBooks)]);
    }


    #[Route('/getAllPersonal', name: 'book_getall_personal', methods: ["POST"])]
    public function getAllPersonalRanking(Request $request, AuthService $authService, BookRepository $bookRepository, SerializerInterface $serializerInterface): Response
    {
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $userId = $userData["user_id"];

        $body = $request->attributes->get("sanitized_body");


        $tags = [];
        if (array_key_exists("tags", $body)){
            $tags = $body["tags"];
        }

        $bookType = null;
        if (array_key_exists("book_type", $body)){
            $bookType = $body["book_type"];

            if ($bookType !== null){
                try {
                    $type = BookType::from($bookType);
                    $bookType = $type->value;
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book type"], 400);
                }
            }
        }
        
        $bookName = "";
        if (array_key_exists("book_name", $body)){
            $bookName = $body["book_name"];
        }

        $status = null;
        if (array_key_exists("status", $body)){
            $status = $body["status"];

            if ($status !== null){
                try {
                    $status = BookStatus::from($status)->value;
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book status"], 400);
                }
            }
        }

        $allBooks = $bookRepository->getAllRanked(
            tags: $tags,
            bookType: $bookType,
            userId: $userId,
            bookName: $bookName,
            orderBy: "DESC",
            status: $status
        );

        $jsonBooks = $serializerInterface->serialize($allBooks, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","books" => json_decode($jsonBooks)]);
    }

    #[Route('/getOneById/{id}', name: 'book_getonebyid', methods: ["GET"])]
    public function getOneById(int $id, Request $request, AuthService $authService, BookRepository $bookRepository, SerializerInterface $serializerInterface): Response
    {
        $loggedIn = false;

        if ($request->headers->get("authorization")){
            $loggedIn = true;
            try{
                $authService->authenticateByToken($request);
            }
            catch(Exception $e){
                $errorMessage = $e->getMessage();
                return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
            }
        }

        $book = $bookRepository->findOneBy(["id" => $id]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "No book with id : $id"], 400);
        }

        if ($loggedIn){
            $jsonBook = $serializerInterface->serialize($book, 'json', context: ['groups' => "classic"]);
        }
        else{
            $jsonBook = $serializerInterface->serialize($book, 'json', context: ['groups' => "unlogged"]);
        }

        return $this->json(["result" => "success","book" => json_decode($jsonBook)]);
    }

    #[Route('/validate', name: 'book_validate', methods: ["POST"])]
    public function validateBook(Request $request, AuthService $authService, BookRepository $bookRepository, EntityManagerInterface $em){
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        if (!in_array("ROLE_ADMIN", $userData["roles"])){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided"], 400);
        }

        $bookId = $body["id"];
        $bookToValidate = $bookRepository->findOneBy(["id" => $bookId]);
        
        if ($bookToValidate == null){
            return $this->json(["result" => "error", "error" => "There is no book for book id $bookId"], 400);
        }

        $bookToValidate->setIsActive(true);
        $em->flush();

        return $this->json(["result" => "success"]);
    }



    #[Route('/create', name: 'book_create', methods: ["POST"])]
    public function createBook(Request $request, AuthService $authService, BookRepository $bookRepository, EntityManagerInterface $em, ImageManager $imageManager, TagRepository $tagRepository){
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("name", $body)){
            return $this->json(["result" => "error", "error" => "No name provided"], 400);
        }
        if (!array_key_exists("description", $body)){
            return $this->json(["result" => "error", "error" => "No description provided"], 400);
        }
        if (!array_key_exists("image", $body)){
            return $this->json(["result" => "error", "error" => "No image provided"], 400);
        }
        if (!array_key_exists("tags_ids", $body)){
            return $this->json(["result" => "error", "error" => "At least one tag_id is needed to create a book"], 400);
        }

        $bookType = null;
        if (array_key_exists("book_type", $body)){
            $bookType = $body["book_type"];

            if ($bookType !== null){
                try {
                    $bookType = BookType::from($bookType);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book type"], 400);
                }
            }
        }
        else{
            return $this->json(["result" => "error","error" => "No book type provided"], 400);
        }

        $status = null;
        if (array_key_exists("status", $body)){
            $status = $body["status"];


            if ($status !== null){
                try {
                    $status = BookStatus::from($status);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book status"], 400);
                }
            }
        }
        else{
            return $this->json(["result" => "error","error" => "No book status provided"], 400);
        }

        $bookName = $body["name"];
        $bookDescription = $body["description"];
        $bookImage = $body["image"];
        $bookTagsIds = $body["tags_ids"];

        try{
            $is_base_64 = base64_encode(base64_decode($bookImage)) == $bookImage;
            if (!$is_base_64){
                return $this->json(["result" => "error", "error" => "The provided image is not a valid base64-encoded image"], 400);
            }
        }
        catch(Exception $e){
            return $this->json(["result" => "error", "error" => "The provided image is not a valid base64-encoded image"], 400);
        }

        $imageName =$imageManager->saveBase64ImageInJpegFormat($bookImage);

        if ($imageName == null){
            return $this->json(["result" => "error", "error" => "Unknown error occured when saving the image"], 500);
        }

        $tags = $tagRepository->findBy(["id" => $bookTagsIds]);

        if (Count($tags) != Count($bookTagsIds)){
            return $this->json(["result" => "error", "error" => "At least one of the provided tags does not exist"], 400);
        }


        $book = new Book();
        $book->setName($bookName);
        $book->setDescription($bookDescription);
        $book->setImagePath($imageName);
        $book->setBookType($bookType);
        $book->setStatus($status);

        $book->setIsActive(true);
    
        foreach ($tags as $tag){
            $book->addTag($tag);
        }

        $em->persist($book);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/update', name: 'book_update', methods: ["POST"])]
    public function updateBook(Request $request, AuthService $authService, BookRepository $bookRepository, EntityManagerInterface $em, ImageManager $imageManager, TagRepository $tagRepository){
        $userData = [];
        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        if (!in_array("ROLE_ADMIN", $userData["roles"])){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided"], 400);
        }
        $id = $body["id"];

        //Check book existence
        $book = $bookRepository->findOneBy(["id" => $id]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "Book with provided id couldn't be found"], 400);
        }

        //Name validation
        $name = null;
        if (array_key_exists("name", $body)){
            $name = $body["name"];

            //checking name availability
            $bookFound = $bookRepository->findOneBy(["name" => $name]);

            if ($bookFound != null){
                return $this->json(["result" => "error", "error" => "Provided name is already used"], 400);
            }
        }

        //Description validation
        $description = null;
        if (array_key_exists("description", $body)){
            $description = $body["description"];

            if ($description == ""){
                return $this->json(["result" => "error", "error" => "Provided description mustn(t be empty"], 400);
            }
        }


        //Image validation
        $image = null;
        if (array_key_exists("image", $body)){
            $image = $body["image"];

            try{
                $is_base_64 = base64_encode(base64_decode($image)) == $image;
                if (!$is_base_64){
                    return $this->json(["result" => "error", "error" => "The provided image is not a valid base64-encoded image"], 400);
                }
            }
            catch(Exception $e){
                return $this->json(["result" => "error", "error" => "The provided image is not a valid base64-encoded image"], 400);
            }
        }

        $tagsIds = null;
        if (array_key_exists("tags_ids", $body)){
            $tagsIds = $body["tags_ids"];
        }

        //Booktype validation
        $bookType = null;
        if (array_key_exists("book_type", $body)){
            $bookType = $body["book_type"];

            if ($bookType !== null){
                try {
                    $bookType = BookType::from($bookType);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book type"], 400);
                }
            }
        }

        //Status validation
        $status = null;
        if (array_key_exists("status", $body)){
            $status = $body["status"];


            if ($status !== null){
                try {
                    $status = BookStatus::from($status);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book status"], 400);
                }
            }
        }


        if ($tagsIds != null){

            //Validate tags existence
            $tags = $tagRepository->findBy(["id" => $tagsIds]);

            if (Count($tags) != Count($tagsIds)){
                return $this->json(["result" => "error", "error" => "At least one of the provided tags does not exist"], 400);
            }

            //Setting new tags

            $book->getTags()->clear();

            foreach ($tags as $tag){
                $book->addTag($tag);
            }
        }

        if ($image != null){
            //Deleting old image
            $imageManager->deleteImage($book->getImagePath());

            //Creating new image
            $imageName = $imageManager->saveBase64ImageInJpegFormat($image);

            if ($imageName == null){
                return $this->json(["result" => "error", "error" => "Unknown error occured when saving the image"], 500);
            }

            $book->setImagePath($imageName);
        }

        //Setting new name, description, bookType, bookStatus

        if ($name != null){
            $book->setName($name);
        }
        if ($description != null){
            $book->setDescription($description);
        }
        if ($bookType != null){
            $book->setBookType($bookType);
        }
        if ($status != null){
            $book->setStatus($status);
        }

        $em->flush();
        return $this->json(["result" => "success"]);
    }



    #[Route('/delete', name: 'book_delete', methods: ["POST"])]
    public function delete(Request $request, AuthService $authService, BookRepository $bookRepository, EntityManagerInterface $em, ImageManager $imageManager): Response
    {
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        if (!in_array("ROLE_ADMIN", $userData["roles"])){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");


        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error","error" => "No id provided"], 400);
        }

        $bookId = $body["id"];
        $bookToDelete = $bookRepository->findOneBy(["id" => $bookId]);

        if ($bookToDelete == null){
            return $this->json(["result" => "error", "error" => "There is no book for book id $bookId"], 400);
        }

        $image_path = $bookToDelete->getImagePath();


        $em->remove($bookToDelete);
        $em->flush();

        $imageRemovedSuccesfully = $imageManager->deleteImage($image_path);

        if (!$imageRemovedSuccesfully){
            return $this->json(["result" => "error", "error" => "The image couldn't be removed, but the book was deleted"], 400);
        }

        return $this->json(["result" => "success"]);
    }
}
