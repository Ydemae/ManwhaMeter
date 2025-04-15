<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\RegisterInviteRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/user')]
final class UserController extends AbstractController
{
    #[Route('/getOneById/{id}', name: 'user_getonebyid', methods: ["GET"])]
    public function getOneById(int $id, AuthService $authService, Request $request, SerializerInterface $serializerInterface, UserRepository $userRepository): Response
    {
        $userData = [];

        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception $e){
            $errorMessage = $e->getMessage();
            return $this->json(["result" => "error","error" => "Access denied : $errorMessage"], 401);
        }

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user with id : $id"], 400);
        }

        $jsonUser = $serializerInterface->serialize($user, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","user" => json_decode($jsonUser)]);
    }

    #[Route('/getAll', name: 'user_getall', methods: ["POST"])]
    public function getAll(AuthService $authService, Request $request, SerializerInterface $serializerInterface, UserRepository $userRepository): Response
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

        $users = $userRepository->findAll();


        $jsonUsers = $serializerInterface->serialize($users, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","users" => json_decode($jsonUsers)]);
    }

    #[Route('/create', name: 'user_create', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $em, PasswordHasherFactoryInterface $passwordHasherFactoryInterface, RegisterInviteRepository $registerInviteRepository): Response
    {
        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);

        if (!array_key_exists("invite", $body)){
            return $this->json(["result" => "error", "error" => "No invite_uid provided for creation"], 400);
        }
        if (!array_key_exists("username", $body)){
            return $this->json(["result" => "error", "error" => "No username provided for creation"], 400);
        }
        if (!array_key_exists("password", $body)){
            return $this->json(["result" => "error", "error" => "No password provided for creation"], 400);
        }

        $username = $body["username"];
        $password = $body["password"];
        $invite = $body["invite"];

        $fetchedInvite = $registerInviteRepository->findOneBy(["uid" => $invite]);

        if ($fetchedInvite == null){
            return $this->json(["result" => "error", "error" => "Incorrect or expired invite"], 403);
        }
        if ($fetchedInvite->isUsed()){
            return $this->json(["result" => "error", "error" => "Incorrect or expired invite"], 403);
        }

        $passwordHasher = $passwordHasherFactoryInterface->getPasswordHasher(User::class);

        $hashedPassword = $passwordHasher->hash(
            $password
        );

        $user = new User();
        $user->setUsername($username);
        $user->setPassword($hashedPassword);
        $user->setRoles(["ROLE_USER"]);
        $user->setCreatedAt(new DateTimeImmutable());

        $em->persist($user);
        $fetchedInvite->setUsed(true);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/update', name: 'user_update', methods: ["POST"])]
    public function update(AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository, PasswordHasherFactoryInterface $passwordHasherFactoryInterface): Response
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

        if (!array_key_exists("userId", $body)){
            return $this->json(["result" => "error", "error" => "No userId provided for user update"], 400);
        }

        if (!in_array("ROLE_ADMIN", $userData["roles"]) && $userId != $body["userId"]){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }
        

        if (!array_key_exists("username", $body)){
            return $this->json(["result" => "error", "error" => "No username provided for update"], 400);
        }
        if (!array_key_exists("password", $body)){
            return $this->json(["result" => "error", "error" => "No password provided for update"], 400);
        }

        $user = $userRepository->findOneBy(["id" => $body["userId"]]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Incorrect user id provided"], 400);
        }

        $username = $body["username"];
        $password = $body["password"];

        if ($user->getPassword() != $password){
            $passwordHasher = $passwordHasherFactoryInterface->getPasswordHasher(User::class);

            $hashedPassword = $passwordHasher->hash(
                $password
            );

            $user->setPassword($hashedPassword);
        }

        $user->setUsername($username);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    
    #[Route('/delete/{id}', name: 'user_delete', methods: ["GET"])]
    public function delete(int $id, AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository): Response
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

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Wrong user id given"], 400);
        }

        $em->remove($user);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/username_exists', name: 'username_exists', methods: ["POST"])]
    public function exists(Request $request, RegisterInviteRepository $registerInviteRepository, UserRepository $userRepository): Response
    {
        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);


        if (!array_key_exists("invite", $body)){
            return $this->json(["result" => "error", "error" => "No invite provided to check username availability"], 400);
        }

        if (!array_key_exists("username", $body)){
            return $this->json(["result" => "error", "error" => "No username provided to check username availability"], 400);
        }

        $invite = $registerInviteRepository->findOneBy(["uid" => $body["invite"]]);

        if ($invite == null){
            return $this->json(["result" => "error", "error" => "Access denied"], 401);
        }

        $usernameExists = $userRepository->usernameExists($body["username"]);

        return $this->json(["result" => "success", "exists" => $usernameExists]);
    }
}
