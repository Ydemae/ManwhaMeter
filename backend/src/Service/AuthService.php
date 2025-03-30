<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class AuthService
{
    private TokenManagementService $tokenManagementService;
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $userPasswordHasherInterface;

    public function __construct(TokenManagementService $tokenManagementService, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasherInterface)
    {
        $this->tokenManagementService = $tokenManagementService;
        $this->userRepository = $userRepository;
        $this->userPasswordHasherInterface = $userPasswordHasherInterface;
    }

    public function getAuthToken(string $username, string $password): string{
        $user = $this->userRepository->findOneBy(["username" => $username]);

        if ($user == null){
            throw new Exception("Incorrect identifier or password provided");
        }

        if ($this->userPasswordHasherInterface->isPasswordValid($user, $password)){
            return $this->tokenManagementService->generateToken($user);
        }

        throw new Exception("Incorrect identifier or password provided");
    }

    public function decodeAuthToken(string $token): array{
        $correctToken = $this->removeBearerFromAuthToken($token);

        return $this->tokenManagementService->decodeToken($correctToken);
    }

    public function authenticateByToken(Request $request): array{
        $authToken = $request->headers->get("authorization");

        if (!$authToken){
            throw new Exception("No token provided");
        }

        return $this->decodeAuthToken($authToken);
    }

    private function removeBearerFromAuthToken(string $token) : string{
        if (str_starts_with($token, "Bearer ")){
            return substr($token, 7);
        }
        return $token;
    }
}
