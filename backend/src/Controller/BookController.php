<?php

namespace App\Controller;

use App\Entity\Book;
use App\Repository\BookRepository;
use App\Repository\BookTypeRepository;
use App\Repository\StatusRepository;
use App\Repository\TagRepository;
use App\Service\AuthService;
use App\Service\ImageManager;
use BookStatus;
use BookType;
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
    public function getAll(Request $request, AuthService $authService, BookRepository $bookRepository, SerializerInterface $serializerInterface): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"]);
        }

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


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
                    return $this->json(["result" => "error","error" => "Incorrect book type"]);
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
                    return $this->json(["result" => "error","error" => "Incorrect book status"]);
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

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


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
                    return $this->json(["result" => "error","error" => "Incorrect book type"]);
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
                    return $this->json(["result" => "error","error" => "Incorrect book status"]);
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
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $userId = $userData["user_id"];


        $book = $bookRepository->findOneBy(["id" => $id]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "No book with id : $id"]);
        }

        $jsonBook = $serializerInterface->serialize($book, 'json', context: ['groups' => "classic"]);

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

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided"]);
        }

        $bookId = $body["id"];
        $bookToValidate = $bookRepository->findOneBy(["id" => $bookId]);
        
        if ($bookToValidate == null){
            return $this->json(["result" => "error", "error" => "There is no book for book id $bookId"]);
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

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);

        if (!array_key_exists("name", $body)){
            return $this->json(["result" => "error", "error" => "No name provided"]);
        }
        if (!array_key_exists("description", $body)){
            return $this->json(["result" => "error", "error" => "No description provided"]);
        }
        if (!array_key_exists("image", $body)){
            return $this->json(["result" => "error", "error" => "No image provided"]);
        }
        if (!array_key_exists("tags_ids", $body)){
            return $this->json(["result" => "error", "error" => "At least one tag_id is needed to create a book"]);
        }

        $bookType = null;
        if (array_key_exists("book_type", $body)){
            $bookType = $body["book_type"];

            if ($bookType !== null){
                try {
                    $bookType = BookType::from($bookType);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book type"]);
                }
            }
        }
        else{
            return $this->json(["result" => "error","error" => "No book type provided"]);
        }

        $status = null;
        if (array_key_exists("status", $body)){
            $status = $body["status"];


            if ($status !== null){
                try {
                    $status = BookStatus::from($status);
                } catch (ValueError $e) {
                    return $this->json(["result" => "error","error" => "Incorrect book status"]);
                }
            }
        }
        else{
            return $this->json(["result" => "error","error" => "No book status provided"]);
        }

        $bookName = $body["name"];
        $bookDescription = $body["description"];
        $bookImage = $body["image"];
        $bookTagsIds = $body["tags_ids"];

        try{
            $is_base_64 = base64_encode(base64_decode($bookImage)) == $bookImage;
            if (!$is_base_64){
                return $this->json(["result" => "error", "error" => "The image passed is not a valid base64-encoded image"]);
            }
        }
        catch(Exception $e){
            return $this->json(["result" => "error", "error" => "The image passed is not a valid base64-encoded image"]);
        }

        $imageName =$imageManager->saveBase64ImageInJpegFormat($bookImage);

        if ($imageName == null){
            return $this->json(["result" => "error", "error" => "Unknown error occured when saving the image"]);
        }

        $tags = $tagRepository->findBy(["id" => $bookTagsIds]);

        if (Count($tags) != Count($bookTagsIds)){
            return $this->json(["result" => "error", "error" => "At least one tag provided does not exist"]);
        }


        $book = new Book();
        $book->setName($bookName);
        $book->setDescription($bookDescription);
        $book->setImagePath($imageName);
        $book->setBookType($bookType);
        $book->setBookStatus($status);

        $book->setIsActive(false);
    
        foreach ($tags as $tag){
            $book->addTag($tag);
        }

        $em->persist($book);
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

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error","error" => "No id provided"]);
        }

        $bookId = $body["id"];
        $bookToDelete = $bookRepository->findOneBy(["id" => $bookId]);

        if ($bookToDelete == null){
            return $this->json(["result" => "error", "error" => "There is no book for book id $bookId"]);
        }

        $image_path = $bookToDelete->getImagePath();


        $em->remove($bookToDelete);
        $em->flush();
        
        $imageRemovedSuccesfully = $imageManager->deleteImage($image_path);

        if (!$imageRemovedSuccesfully){
            return $this->json(["result" => "error", "error" => "The image couldn't be removed, but the book was deleted"]);
        }
        
        return $this->json(["result" => "success"]);
    }
}
