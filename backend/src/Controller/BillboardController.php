<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Entity\BillboardAnnouncement;
use App\Repository\BillboardAnnouncementRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/billboard')]
final class BillboardController extends AbstractController
{
    #[IsGranted('ROLE_ADMIN')]
    #[Route('/getAll', name: 'billboard_getall', methods: ["GET"])]
    public function getAll(SerializerInterface $serializerInterface, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $announcements = $billboardAnnouncementRepository->findAll();

        $jsonAnnoucements = $serializerInterface->serialize($announcements, 'json', ['groups' => "admin"]);

        return $this->json(["result" => "success","announcements" => json_decode($jsonAnnoucements)]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/getOneById/{id}', name: 'billboard_getOneById', methods: ["GET"])]
    public function getOneById(int $id, Request $request, SerializerInterface $serializerInterface, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $announcement = $billboardAnnouncementRepository->findOneBy(["id" => $id]);
        
        if ($announcement == null){
            return $this->json(["result" => "error", "error" => "No announcement for this id"], 400);
        }

        $jsonAnnoucement = $serializerInterface->serialize($announcement, 'json', ['groups' => "admin"]);

        return $this->json(["result" => "success","announcement" => json_decode($jsonAnnoucement)]);
    }

    #[Route('/getAllActive', name: 'billboard_getallactive', methods: ["GET"])]
    public function getAllActive(Request $request, SerializerInterface $serializerInterface, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $announcements = $billboardAnnouncementRepository->getAllActive();

        $jsonAnnoucements = $serializerInterface->serialize($announcements, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","announcements" => json_decode($jsonAnnoucements)]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/create', name: 'billboard_create', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("message", $body)){
            return $this->json(["result" => "error", "error" => "No message provided for billboard announcement creation"], 400);
        }
        if (!array_key_exists("title", $body)){
            return $this->json(["result" => "error", "error" => "No title provided for billboard announcement creation"], 400);
        }

        $message = $body["message"];
        $title = $body["title"];

        $active = true;
        if (array_key_exists("active", $body)){
            $active = $body["active"];
        }

        $announcement = new BillboardAnnouncement();
        $announcement->setCreatedAt(new DateTimeImmutable());
        $announcement->setActive($active);
        $announcement->setMessage($message);
        $announcement->setTitle($title);

        $em->persist($announcement);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/update', name: 'billboard_update', methods: ["POST"])]
    public function update(Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided for billboard announcement update"], 400);
        }
        $message = null;
        if (array_key_exists("message", $body)){
            $message = $body["message"];
        }
        $title = null;
        if (array_key_exists("title", $body)){
            $title = $body["title"];
        }

        if ($message == null && $title == null){
            return $this->json(["result" => "error", "error" => "No message or title provided for announcement update"], 400);
        }

        $announcement = $billboardAnnouncementRepository->findOneBy(["id" => $body["id"]]);

        if ($announcement == null){
            return $this->json(["result" => "error", "error" => "Announcement doesn't exist"], 400);
        }

        if ($message != null){
            $announcement->setMessage($message);
        }
        if ($title != null){
            $announcement->setTitle($title);
        }

        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/delete', name: 'billboard_delete', methods: ["POST"])]
    public function delete(Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided for billboard announcement deletion"], 400);
        }

        $announcement = $billboardAnnouncementRepository->findOneBy(["id" => $body["id"]]);

        if ($announcement == null){
            return $this->json(["result" => "error", "error" => "Incorrect announcement id provided"], 400);
        }
        
        $em->remove($announcement);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/deactivate', name: 'billboard_deactivate', methods: ["POST"])]
    public function deactivate(Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided for billboard announcement deactivation"], 400);
        }

        $announcement = $billboardAnnouncementRepository->findOneBy(["id" => $body["id"]]);

        if ($announcement == null){
            return $this->json(["result" => "error", "error" => "Incorrect announcement id provided"], 400);
        }
        
        $announcement->setActive(false);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/activate', name: 'billboard_activate', methods: ["POST"])]
    public function activate(Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("id", $body)){
            return $this->json(["result" => "error", "error" => "No id provided for billboard announcement activation"], 400);
        }

        $announcement = $billboardAnnouncementRepository->findOneBy(["id" => $body["id"]]);

        if ($announcement == null){
            return $this->json(["result" => "error", "error" => "Incorrect announcement id provided"], 400);
        }
        
        $announcement->setActive(true);
        $em->flush();

        return $this->json(["result" => "success"]);
    }
}
