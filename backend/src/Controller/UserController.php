<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Entity\User;
use App\Repository\RegisterInviteRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
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
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user with id : $id"], 400);
        }

        $jsonUser = $serializerInterface->serialize($user, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","user" => json_decode($jsonUser)]);
    }

    #[Route('/getAll/{active}', name: 'user_getall', methods: ["GET"])]
    public function getAll(int $active, AuthService $authService, Request $request, SerializerInterface $serializerInterface, UserRepository $userRepository): Response
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

        /*  Active 0 searches all inactive users
            Active 1 serches all active users
            Active 2 saerches all users indiscriminately of their activation
        */
        $users = $active == 0 ?  $userRepository->findBy(["active" => false]) : ($active == 1 ? $userRepository->findBy(["active" => true]) : $users = $userRepository->findAll());

        $jsonUsers = $serializerInterface->serialize($users, 'json', ['groups' => "admin"]);

        return $this->json(["result" => "success","users" => json_decode($jsonUsers)]);
    }

    #[Route('/create', name: 'user_create', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $em, PasswordHasherFactoryInterface $passwordHasherFactoryInterface, RegisterInviteRepository $registerInviteRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");

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
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("userId", $body)){
            return $this->json(["result" => "error","error" => "No user id provided"], 400);
        }
        $userId = $body["userId"];

        if (!in_array("ROLE_ADMIN", $userData["roles"]) || $userId == $userData["user_id"]){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $new_username = null;
        if (array_key_exists("username", $body)){
            $new_username = $body["username"];
        }
        $new_password = null;
        if (array_key_exists("password", $body)){
            $new_password = $body["password"];
        }

        if ($new_username == null && $new_password == null){
            return $this->json(["result" => "error","error" => "No data to update"], 400);
        }

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Incorrect user id provided"], 400);
        }

        if ($new_password != null){
            $passwordHasher = $passwordHasherFactoryInterface->getPasswordHasher(User::class);

            $hashedPassword = $passwordHasher->hash(
                $new_password
            );

            $user->setPassword($hashedPassword);
        }
        if ($new_username != null && $new_username != $user->getUsername()){

            if ($userRepository->usernameExists($new_username)){
                return $this->json(["result" => "error", "error" => "Username already exists"], 460);
            }

            $user->setUsername($new_username);
        }

        $em->flush();

        return $this->json(["result" => "success"]);
    }

    
    #[Route('/delete', name: 'user_delete', methods: ["POST"])]
    public function delete(AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository): Response
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

        if (!array_key_exists("user_id", $body)){
            return $this->json(["result" => "error", "error" => "No user_id provided for user deletion"], 400);
        }

        $id = $body["user_id"];

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Wrong user id given"], 400);
        }

        $em->remove($user);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/deactivate', name: 'user_deactivate', methods: ["POST"])]
    public function deactivate(AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository): Response
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

        if (!array_key_exists("user_id", $body)){
            return $this->json(["result" => "error", "error" => "No user_id provided for user deactivation"], 400);
        }

        $id = $body["user_id"];

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Wrong user id given"], 400);
        }

        $user->setActive(false);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/activate', name: 'user_activate', methods: ["POST"])]
    public function activate(AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository): Response
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

        if (!array_key_exists("user_id", $body)){
            return $this->json(["result" => "error", "error" => "No user_id provided for user reactivation"], 400);
        }

        $id = $body["user_id"];

        $user = $userRepository->findOneBy(["id" => $id]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Wrong user id given"], 400);
        }

        $user->setActive(true);
        $em->flush();

        return $this->json(["result" => "success"]);
    }

    #[Route('/username_exists', name: 'username_exists', methods: ["POST"])]
    public function exists(Request $request, RegisterInviteRepository $registerInviteRepository, UserRepository $userRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");


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

    #[Route('/getMyInfo', name: 'user_get_my_info', methods: ["GET"])]
    public function getMyInfi(Request $request, AuthService $authService, UserRepository $userRepository, SerializerInterface $serializerInterface): Response
    {
        $userData = [];
        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }
        $userId = $userData["user_id"];

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "No user for current token"], 400);
        }

        $jsonUser = $serializerInterface->serialize($user, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","user" => json_decode($jsonUser)]);
    }


    #[Route('/changePassword', name: 'user_change_password', methods: ["POST"])]
    public function changePassword(AuthService $authService, Request $request, EntityManagerInterface $em, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasherInterface, PasswordHasherFactoryInterface $passwordHasherFactoryInterface): Response
    {
        $userData = [];
        try{
            $userData = $authService->authenticateByToken($request);
        }
        catch(Exception){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }
        $userId = $userData["user_id"];

        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("old_password", $body)){
            return $this->json(["result" => "error","error" => "Old password is missing"], 400);
        }
        $oldPassword = $body["old_password"];

        if (!array_key_exists("new_password", $body)){
            return $this->json(["result" => "error","error" => "New password is missing"], 400);
        }
        $newPassword = $body["new_password"];

        $user = $userRepository->findOneBy(["id" => $userId]);

        if ($user == null){
            return $this->json(["result" => "error","error" => "User doesn't exist"], 400);
        }

        if (!$userPasswordHasherInterface->isPasswordValid($user, $oldPassword)){
            return $this->json(["result" => "error","error" => "Incorrect password"], 460);
        }

        if ($newPassword != null){
            $passwordHasher = $passwordHasherFactoryInterface->getPasswordHasher(User::class);

            $hashedPassword = $passwordHasher->hash(
                $newPassword
            );

            $user->setPassword($hashedPassword);
        }

        $em->flush();

        return $this->json(["result" => "success"]);
    }
}
