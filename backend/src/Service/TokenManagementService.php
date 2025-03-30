<?php

namespace App\Service;

use App\Entity\User;
use DateTime;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class TokenManagementService
{
    private JWTTokenManagerInterface $jwtManager;
    private JWTEncoderInterface $jwtEncoder;

    public function __construct(JWTTokenManagerInterface $jwtManager, JWTEncoderInterface $jwtEncoder)
    {
        $this->jwtManager = $jwtManager;
        $this->jwtEncoder = $jwtEncoder;
    }

    public function generateToken(User $user): string
    {
        try{
            return $this->jwtEncoder->encode([
                "user_id" => $user->getId(),
                "roles" => $user->getRoles()
            ]);
        }
        catch(Exception $e){
            throw new Exception("Could not create token");
        }
    }

    public function decodeToken(string $token): array
    {
        try{
            $decodedToken = $this->jwtEncoder->decode($token);

            if (!$decodedToken){
                throw new Exception("Invalid token");
            }

            $result = [
                "user_id" => $decodedToken["user_id"],
                "roles" => $decodedToken["roles"],
            ];

            return $result;
        }
        catch(Exception $e){
            throw new Exception("Invalid token");
        }
    }
}