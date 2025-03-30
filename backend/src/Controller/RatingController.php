<?php

namespace App\Controller;

use App\Entity\Rating;
use App\Repository\BookRepository;
use App\Repository\RatingRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/ratings')]
final class RatingController extends AbstractController
{
    #[Route('/getOneById/{id}', name: 'rating_getonebyid', methods: ["GET"])]
    public function getOneById(int $id, AuthService $authService, Request $request, SerializerInterface $serializerInterface, RatingRepository $ratingRepository): Response
    {
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $rating = $ratingRepository->findOneBy(["id" => $id]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating with id : $id"], 400);
        }

        $jsonRating = $serializerInterface->serialize($rating, 'json', ['groups' => "rating"]);

        return $this->json(["result" => "success","rating" => json_decode($jsonRating)]);
    }

    #[Route('/getAll', name: 'rating_getall', methods: ["POST"])]
    public function getAll(AuthService $authService, Request $request, SerializerInterface $serializerInterface, RatingRepository $ratingRepository): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $ratings = $ratingRepository->findAll();


        $jsonRatings = $serializerInterface->serialize($ratings, 'json', ['groups' => "rating"]);

        return $this->json(["result" => "success","ratings" => json_decode($jsonRatings)]);
    }

    #[Route('/create', name: 'rating_create', methods: ["POST"])]
    public function create(AuthService $authService, Request $request, EntityManagerInterface $em, BookRepository $bookRepository, UserRepository $userRepository, RatingRepository $ratingRepository): Response
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


        if (!array_key_exists("book_id", $body)){
            return $this->json(["result" => "error", "error" => "No book_id provided for creation"], 400);
        }

        if (!array_key_exists("story", $body)){
            return $this->json(["result" => "error", "error" => "No story grade prodived for creation"], 400);
        }
        if (!array_key_exists("art_style", $body)){
            return $this->json(["result" => "error", "error" => "No art_style grade prodived for creation"], 400);
        }
        if (!array_key_exists("feeling", $body)){
            return $this->json(["result" => "error", "error" => "No feeling grade prodived for creation"], 400);
        }
        if (!array_key_exists("characters", $body)){
            return $this->json(["result" => "error", "error" => "No characters grade prodived for creation"], 400);
        }

        $comment = "";
        if (array_key_exists("comment", $body)){
            $comment = $body["comment"];
        }

        $book_id = $body["book_id"];
        $story = $body["story"];
        $art_style = $body["art_style"];
        $feeling = $body["feeling"];
        $characters = $body["characters"];


        $book = $bookRepository->findOneBy(["id" => $book_id]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "No book exists with the provided book id"], 400);
        }

        if ($ratingRepository->has_rated_book(
            userId: $userData["user_id"],
            bookId: $book_id
        )){
            return $this->json(["result" => "error", "error" => "You have already rated this book, you can't rate it again unless you delete your previous rating."]);
        }

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user exists with the provided user id"], 400);
        }

        $rating = new Rating();
        $rating->setBook($book);
        $rating->setUser($user);
        $rating->setStory($story);
        $rating->setArtStyle($art_style);
        $rating->setFeeling($feeling);
        $rating->setCharacters($characters);
        $rating->setComment($comment);

        $em->persist($rating);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/update', name: 'rating_update', methods: ["POST"])]
    public function update(AuthService $authService, Request $request, EntityManagerInterface $em, RatingRepository $ratingRepository, UserRepository $userRepository): Response
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


        if (!array_key_exists("ratingId", $body)){
            return $this->json(["result" => "error", "error" => "No ratingId provided for creation"], 400);
        }

        if (!array_key_exists("story", $body)){
            return $this->json(["result" => "error", "error" => "No story grade prodived for creation"], 400);
        }
        if (!array_key_exists("art_style", $body)){
            return $this->json(["result" => "error", "error" => "No art_style grade prodived for creation"], 400);
        }
        if (!array_key_exists("feeling", $body)){
            return $this->json(["result" => "error", "error" => "No feeling grade prodived for creation"], 400);
        }
        if (!array_key_exists("characters", $body)){
            return $this->json(["result" => "error", "error" => "No characters grade prodived for creation"], 400);
        }

        $comment = "";
        if (array_key_exists("comment", $body)){
            $comment = $body["comment"];
        }
        $story = $body["story"];
        $art_style = $body["art_style"];
        $feeling = $body["feeling"];
        $characters = $body["characters"];
        $ratingId = $body["ratingId"];

        $rating = $ratingRepository->findOneBy(["id" => $ratingId]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating exists with the provided rating id"], 400);
        }

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user exists with the provided user id"], 400);
        }

        if ($rating->getUser()->getId() != $userId){
            return $this->json(["result" => "error", "error" => "You are not allowed to update someone else's rating"], 401);
        }

        $rating->setStory($story);
        $rating->setArtStyle($art_style);
        $rating->setFeeling($feeling);
        $rating->setCharacters($characters);
        $rating->setComment($comment);

        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/delete/{id}', name: 'rating_delete', methods: ["GET"])]
    public function delete(int $id, AuthService $authService, Request $request, EntityManagerInterface $em, RatingRepository $ratingRepository): Response
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
        

        $rating = $ratingRepository->findOneBy(["id" => $id]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating exists with rating id prodivded"], 400);
        }

        if ($rating->getUser()->getId() != $userId){
            return $this->json(["result" => "error", "error" => "You are not allowed to delete someone else's rating"], 401);
        }

        $em->remove($rating);
        $em->flush();

        return $this->json(["result" => "success"]);
    }
}
