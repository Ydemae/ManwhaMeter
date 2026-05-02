<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Entity\Rating;
use App\Repository\BookRepository;
use App\Repository\RatingRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/ratings')]
final class RatingController extends AbstractController
{
    #[Route('/getOneById/{id}', name: 'rating_getonebyid', methods: ["GET"])]
    public function getOneById(int $id, Request $request, SerializerInterface $serializerInterface, RatingRepository $ratingRepository, UserRepository $userRepository, Security $security): Response
    {
        $rating = $ratingRepository->findOneBy(["id" => $id]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating with id : $id"], 400);
        }

        if ($rating->isPrivate()){
            $securityUser = $security->getUser();
            $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
            if ($user == null){
                return $this->json(["result" => "error","error" => "Access denied"], 401);
            }

            if ($rating->getUser() != $user){
                return $this->json(["result" => "error","error" => "Access denied"], 401);
            }
        }

        $jsonRating = $serializerInterface->serialize($rating, 'json', ['groups' => "admin"]);

        return $this->json(["result" => "success","rating" => json_decode($jsonRating)]);
    }

    #[Route('/getOneByBookId/{bookId}', name: 'rating_getOneByBookId', methods: ["GET"])]
    public function getOneByBookId(int $bookId, Request $request, SerializerInterface $serializerInterface, RatingRepository $ratingRepository, Security $security, UserRepository $userRepository): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $userId = $user->getId();

        $rating = $ratingRepository->findOneBy(["user" => $userId, "book" => $bookId]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "You haven't rated this book yet"], 430);
        }

        $jsonRating = $serializerInterface->serialize($rating, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","rating" => json_decode($jsonRating)]);
    }

    #[Route('/create', name: 'rating_create', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $em, BookRepository $bookRepository, UserRepository $userRepository, RatingRepository $ratingRepository, Security $security): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $userId = $user->getId();

        $body = $request->attributes->get("sanitized_body");

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
        $private = array_key_exists("private", $body) ? $body["private"] : false;

        if (is_string($private) && ($private === "" || $private === "1")) {
            $private = $private === "1";
        } elseif (!is_bool($private)){
            return $this->json(["result" => "error", "error" => "'private' field is not a valid boolean value"], 400);
        }

        $book = $bookRepository->findOneBy(["id" => $book_id]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "No book exists with the provided book id"], 400);
        }

        if ($ratingRepository->has_rated_book(
            userId: $userId,
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
        $rating->setPrivate($private);

        $em->persist($rating);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/update', name: 'rating_update', methods: ["POST"])]
    public function update(Request $request, EntityManagerInterface $em, RatingRepository $ratingRepository, UserRepository $userRepository, Security $security): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $userId = $user->getId();

        $body = $request->attributes->get("sanitized_body");


        if (!array_key_exists("rating_id", $body)){
            return $this->json(["result" => "error", "error" => "No rating_id provided for creation"], 400);
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
        $ratingId = $body["rating_id"];

        $rating = $ratingRepository->findOneBy(["id" => $ratingId]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating exists with the provided rating id"], 400);
        }

        $private = array_key_exists("private", $body) ? $body["private"] : $rating->isPrivate();

        if (is_string($private) && ($private === "" || $private === "1")) {
            $private = $private === "1";
        } elseif (!is_bool($private)){
            return $this->json(["result" => "error", "error" => "'private' field is not a valid boolean value"], 400);
        }

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user exists with the provided user id"], 400);
        }

        if ($rating->getUser()->getId() != $userId){
            return $this->json(["result" => "error", "error" => "You are not allowed to update someone else's rating"], 403);
        }

        $rating->setStory($story);
        $rating->setArtStyle($art_style);
        $rating->setFeeling($feeling);
        $rating->setCharacters($characters);
        $rating->setComment($comment);
        $rating->setPrivate($private);

        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/delete/{id}', name: 'rating_delete', methods: ["DELETE"])]
    public function delete(int $id, Request $request, EntityManagerInterface $em, RatingRepository $ratingRepository, UserRepository $userRepository, Security $security): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $userId = $user->getId();

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            //Voluntarily misleading error message, in order to avoid giving indications to people bruteforcing with custom made tokens
            return $this->json(["result" => "error", "error" => "Access denied"], 401);
        }

        $isAdmin = False;
        if (in_array("ROLE_ADMIN", $user->getRoles())){
            $isAdmin = True;
        }

        $rating = $ratingRepository->findOneBy(["id" => $id]);

        if ($rating == null){
            return $this->json(["result" => "error", "error" => "No rating exists with rating id prodivded"], 400);
        }

        if ($rating->getUser()->getId() != $userId && !$isAdmin){
            return $this->json(["result" => "error", "error" => "You are not allowed to delete someone else's rating"], 401);
        }

        $em->remove($rating);
        $em->flush();

        return $this->json(["result" => "success"]);
    }
}
