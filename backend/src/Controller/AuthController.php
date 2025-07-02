<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\AuthService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth')]
final class AuthController extends AbstractController
{
    #[Route('/getToken', name: 'token_get', methods: ["POST"])]
    public function getToken(Request $request, Security $security, AuthService $authService, UserRepository $userRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");

        if (!array_key_exists("username", $body)){

            return $this->json(
                data: ["result" => "error", "error" => "No username provided for authentication"],
                status: 401
            );
        }
        if (!array_key_exists("password", $body)){
            return $this->json(
                data: ["result" => "error", "error" => "No password provided for authentication"],
                status: 401
            );
        }

        $user = $userRepository->findOneBy(["username" => $body["username"]]);

        if ($user == null){
            return $this->json(["result" => "error", "error" => "Incorrect credentials"],401);
        }

        if ($user->isActive() == false){
            return $this->json(["result" => "error","error" => "Your account has been disabled. If you don't know why, contact your server owner."], 403);
        }

        try{
            $token = $authService->getAuthToken($user, $body["password"]);

            return $this->json(["result" => "success","token" => $token, "isAdmin" => in_array("ROLE_ADMIN", $user->getRoles())]);
        }
        catch(Exception $e){
            return $this->json(["result" => "error", "error" => "Incorrect credentials"],401);
        }
    }

    #[Route('/isTokenValid', name: 'token_valid', methods: ["GET"])]
    public function index(Request $request, Security $security, AuthService $authService): Response
    {

        $auth_token = $request->headers->get("authorization");

        if (!$auth_token){
            return $this->json(["result" => "error","error" => "No token provided"],401);
        }        

        try{
            $authenticatorResponse = $authService->decodeAuthToken($auth_token);
            return $this->json(["result" => "success","valid" => true]);
        }
        catch(AccessDeniedException $e){
            return $this->json(["result" => "success","valid" => false]);
        }
    }
}
