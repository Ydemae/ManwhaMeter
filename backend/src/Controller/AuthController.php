<?php

namespace App\Controller;

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
    public function getToken(Request $request, Security $security, AuthService $authService): Response
    {
        $raw_body = $request->getContent();
        $body = json_decode($raw_body, true);

        if (!array_key_exists("username", $body)){
            $response = [
                "result" => "error",
                "error" => "No username provided for authentication"
            ];

            return $this->json(
                data: json_encode($response),
                status: 401
            );
        }
        if (!array_key_exists("password", $body)){
            $response = [
                "result" => "error",
                "error" => "No password provided for authentication"
            ];

            return $this->json(
                data: json_encode($response),
                status: 401
            );
        }

        try{
            return $this->json(["result" => "success","token" => $authService->getAuthToken($body["username"], $body["password"])]);
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
