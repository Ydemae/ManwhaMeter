<?php

namespace App\Controller;

use App\Entity\BillboardAnnouncement;
use App\Repository\BillboardAnnouncementRepository;
use App\Service\AuthService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/billboard')]
final class BillboardController extends AbstractController
{
    #[Route('/getAll', name: 'billboard_getall', methods: ["GET"])]
    public function getAll(AuthService $authService, Request $request, SerializerInterface $serializerInterface, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        $userData = [];
        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        if (!in_array("ROLE_ADMIN", $userData["roles"])){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $announcements = $billboardAnnouncementRepository->findAll();

        $jsonAnnoucements = $serializerInterface->serialize($announcements, 'json', ['groups' => "admin"]);

        return $this->json(["result" => "success","announcements" => json_decode($jsonAnnoucements)]);
    }

    #[Route('/getAllActive', name: 'billboard_getallactive', methods: ["GET"])]
    public function getAllActive(AuthService $authService, Request $request, SerializerInterface $serializerInterface, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $announcements = $billboardAnnouncementRepository->getAllActive();

        $jsonAnnoucements = $serializerInterface->serialize($announcements, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","announcements" => json_decode($jsonAnnoucements)]);
    }

    #[Route('/create', name: 'billboard_create', methods: ["POST"])]
    public function create(AuthService $authService, Request $request, EntityManagerInterface $em): Response
    {
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

        if (!array_key_exists("message", $body)){
            return $this->json(["result" => "error", "error" => "No message provided for billboard announcement creation"], 400);
        }
        $message = $body["message"];

        $active = true;
        if (array_key_exists("active", $body)){
            $active = $body["active"];
        }

        $user = new BillboardAnnouncement();
        $user->setCreatedAt(new DateTimeImmutable());
        $user->setActive($active);
        $user->setAnnouncementMessage($message);

        $em->persist($user);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/delete', name: 'billboard_delete', methods: ["POST"])]
    public function update(AuthService $authService, Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
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

    #[Route('/deactivate', name: 'billboard_deactivate', methods: ["POST"])]
    public function deactivate(AuthService $authService, Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
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

    #[Route('/activate', name: 'billboard_activate', methods: ["POST"])]
    public function activate(AuthService $authService, Request $request, EntityManagerInterface $em, BillboardAnnouncementRepository $billboardAnnouncementRepository): Response
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
