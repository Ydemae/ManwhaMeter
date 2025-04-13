<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\AuthService;
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
        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);

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

        try{
            $token = $authService->getAuthToken($user, $body["password"]);

            return $this->json(["result" => "success","token" => $token, "isAdmin" => in_array("ROLE_ADMIN", $user->getRoles())]);
        }
        catch(AccessDeniedException $e){
            return $this->json(["result" => "error","error" => $e->getMessage()], 401);
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
