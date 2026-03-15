<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Entity\ReadingListEntry;
use App\Repository\BookRepository;
use App\Repository\ReadingListEntryRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/readingList')]
final class ReadingListController extends AbstractController
{
    #[Route('/getAll', name: 'readinglist_getall', methods: ["GET"])]
    public function getAll(ReadingListEntryRepository $readingListEntryRepository, SerializerInterface $serializerInterface, UserRepository $userRepository, Security $security): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $readingList = $readingListEntryRepository->findBy(["user" => $user->getId()]);

        $jsonReadingList = $serializerInterface->serialize($readingList, 'json', ['groups' => "unlogged"]);

        return $this->json(["result" => "success","readingListEntries" => json_decode($jsonReadingList)]);
    }

    #[Route('/create', name: 'readinglist_create', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $em, BookRepository $bookRepository, UserRepository $userRepository, Security $security){
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        //Checking book existence
        if (!array_key_exists("book_id", $body)){
            return $this->json(["result" => "error", "error" => "No book id provided"], 400);
        }

        $book = $bookRepository->findOneBy(["id" => $body["book_id"]]);

        if ($book == null){
            return $this->json(["result" => "error", "error" => "Book doesn't exists"], 400);
        }

        //Creating entry
        $readingListEntry = new ReadingListEntry();
        $readingListEntry->setUser($user);
        $readingListEntry->setBook($book);

        $em->persist($readingListEntry);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/delete', name: 'readinglist_delete', methods: ["POST"])]
    public function delete(Request $request, ReadingListEntryRepository $readingListEntryRepository, EntityManagerInterface $em, Security $security, UserRepository $userRepository): Response
    {
        $securityUser = $security->getUser();
        $user = $userRepository->findOneBy(["username" => $securityUser->getUserIdentifier()]);
        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error","error" => "No id provided"], 400);
        }

        $ReadingListEntryId = $body["id"];
        $RLEToDelete = $readingListEntryRepository->findOneBy(["id" => $ReadingListEntryId]);

        if ($RLEToDelete == null){
            return $this->json(["result" => "error", "error" => "There is no reading list entry corresponding to provided id"], 400);
        }

        if ($user->getId() != $RLEToDelete->getUser()->getId()){
            return $this->json(["result" => "error", "error" => "Access denied"], 401);
        }

        $em->remove($RLEToDelete);
        $em->flush();

        return $this->json(["result" => "success"]);
    }
}
