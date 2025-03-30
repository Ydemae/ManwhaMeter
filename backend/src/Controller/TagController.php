<?php

namespace App\Controller;

use App\Entity\Tag;
use App\Repository\TagRepository;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/tag')]
final class TagController extends AbstractController
{

    #[Route('/getOneById/{id}', name: 'tag_getonebyid', methods: ["GET"])]
    public function getOneById(int $id, AuthService $authService, Request $request, SerializerInterface $serializerInterface, TagRepository $tagRepository): Response
    {
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $tag = $tagRepository->findOneBy(["id" => $id]);

        if ($tag == null){
            return $this->json(["result" => "error", "error" => "No tag with id : $id"], 400);
        }

        $jsonTag = $serializerInterface->serialize($tag, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","tag" => json_decode($jsonTag)]);
    }

    #[Route('/getAll', name: 'tag_getall', methods: ["GET"])]
    public function getAll(AuthService $authService, Request $request, SerializerInterface $serializerInterface, TagRepository $tagRepository): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $tags = $tagRepository->findAll();


        $jsonTags = $serializerInterface->serialize($tags, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","tags" => json_decode($jsonTags)]);
    }

    #[Route('/create', name: 'tag_create', methods: ["POST"])]
    public function create(AuthService $authService, Request $request, EntityManagerInterface $em): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


        if (!array_key_exists("label", $body)){
            return $this->json(["result" => "error", "error" => "No label provided for creation"], 400);
        }

        $label = $body["label"];
        if (gettype($label) != "string"){
            return $this->json(["result" => "error", "error" => "Label is not a valid string"], 400);
        }

        $tag = new Tag();
        $tag->setLabel($label);
        $tag->setIsActive(true);

        $em->persist($tag);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/update', name: 'tag_update', methods: ["POST"])]
    public function update(AuthService $authService, Request $request, EntityManagerInterface $em, TagRepository $tagRepository): Response
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
            return $this->json(["result" => "error", "error" => "No id provided for creation"], 400);
        }
        if (!array_key_exists("label", $body)){
            return $this->json(["result" => "error", "error" => "No label provided for creation"], 400);
        }
        if (!array_key_exists("is_active", $body)){
            return $this->json(["result" => "error", "error" => "No is_active provided for creation"], 400);
        }

        $id = $body["id"];
        $label = $body["label"];
        $is_active = $body["is_active"];

        $tag = $tagRepository->findOneBy(["id" => $id]);

        if ($tag == null){
            return $this->json(["result" => "error", "error" => "Wrong tag id given"], 400);
        }

        $tag->setLabel($label);
        $tag->setIsActive($is_active);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/validate/{id}', name: 'tag_validate', methods: ["GET"])]
    public function validate(int $id, AuthService $authService, Request $request, EntityManagerInterface $em, TagRepository $tagRepository): Response
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

        $tag = $tagRepository->findOneBy(["id" => $id]);

        if ($tag == null){
            return $this->json(["result" => "error", "error" => "Wrong tag id given"], 400);
        }

        $tag->setIsActive(true);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/delete/{id}', name: 'tag_delete', methods: ["GET"])]
    public function delete(int $id, AuthService $authService, Request $request, EntityManagerInterface $em, TagRepository $tagRepository): Response
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

        $tag = $tagRepository->findOneBy(["id" => $id]);

        if ($tag == null){
            return $this->json(["result" => "error", "error" => "Wrong tag id given"], 400);
        }

        $em->remove($tag);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/exists', name: 'tag_exists', methods: ["POST"])]
    public function exists(AuthService $authService, Request $request, EntityManagerInterface $em, TagRepository $tagRepository): Response
    {
        try{
            $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


        if (!array_key_exists("label", $body)){
            return $this->json(["result" => "error", "error" => "No label provided for search"], 400);
        }

        $label = $body["label"];

        $tag = $tagRepository->findOneBy(["label" => $label]);

        return $this->json(["result" => "success", "exists" => $tag != null]);
    }
}
