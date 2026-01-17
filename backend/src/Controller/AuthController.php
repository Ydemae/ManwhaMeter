<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Controller;

use App\Repository\RefreshTokenRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth')]
final class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): Response
    {
        return $this->json(['message' => 'Login handled by LexikJWT']);
    }

    #[Route('/refresh', name: 'refresh', methods: ['POST'])]
    public function refresh(): Response
    {
        return $this->json(['message' => 'Refresh handled by gesdinet']);
    }

    #[Route('/refresh/invalidate', name: 'refresh_invalidate', methods: ['POST'])]
    public function invalidateRefreshToken(Request $request, EntityManagerInterface $em, RefreshTokenRepository $refreshTokenRepository): Response
    {
        $refreshTokenString = $request->request->get('refresh_token');

        if (!$refreshTokenString) {
            return new JsonResponse(['error' => 'Refresh token is required'], status: 400);
        }

        $refreshToken = $refreshTokenRepository->findOneBy(['refreshToken' => $refreshTokenString]);

        if (!$refreshToken) {
            return new JsonResponse(['error' => 'Refresh token not found'], 404);
        }

        $em->remove($refreshToken);
        $em->flush();

        return new JsonResponse(['message' => 'Refresh token invalidated successfully']);
    }



    /*#[Route('/login', name: 'authlogin', methods: ["POST"])]
    public function login(Request $request, Security $security, AuthService $authService, UserRepository $userRepository): Response
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

        $user = $userRepository->findUser($body["username"]);

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
    }*/


    /*#[Route('/test', name: 'test', methods: ["GET"])]
    public function test(Request $request, Security $security, AuthService $authService, UserRepository $userRepository): Response
    {
        $body = $request->attributes->get("sanitized_body");


        return $this->json(["result" => "success","token" => $token, "isAdmin" => in_array("ROLE_ADMIN", $user->getRoles())]);
    }*/


    /*#[Route('/isTokenValid', name: 'token_valid', methods: ["GET"])]
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
    }*/
}
