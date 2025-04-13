<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\RegisterInvite;
use App\enum\BookStatus;
use App\enum\BookType;
use App\Repository\BookRepository;
use App\Repository\RegisterInviteRepository;
use App\Repository\TagRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use App\Service\ImageManager;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\Uuid;
use ValueError;

#[Route('/registerInvite')]
final class RegisterInviteController extends AbstractController
{
    #[Route('/getAll', name: 'register_invite_getall', methods: ["GET", "POST"])]
    public function getAll(Request $request, AuthService $authService, SerializerInterface $serializerInterface, RegisterInviteRepository $registerInviteRepository): Response
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

        $used = null;

        $method = $request->getMethod();

        if ($method == 'POST'){
            $raw_body = $request->getContent();
            $body = json_decode($raw_body, true);

            if (array_key_exists("used", $body)){
                if ($body["used"] != null && !is_bool($body["used"])){
                    return $this->json(["result" => "error", "error" => "Incorrect body data : used must be a boolean"], 400);
                }

                $used = $body["used"];
            }
        }

        $allRegisterInvites = [];
        if ($used == null){
            $allRegisterInvites = $registerInviteRepository->findBy([], ["createdAt" => "DESC"]);
        }
        else{
            $allRegisterInvites = $registerInviteRepository->findBy(["used" => $used], ["createdAt" => "DESC"]);
        }

        $jsonResults = $serializerInterface->serialize($allRegisterInvites, 'json', ['groups' => "classic"]);

        return $this->json(["result" => "success","invites" => json_decode($jsonResults)]);
    }

    #[Route('/isUsed/{uid}', name: 'invite_is_used', methods: ["GET"])]
    public function isUsed(string $uid, RegisterInviteRepository $registerInviteRepository): Response
    {
        $invite = $registerInviteRepository->findOneBy(["uid" => $uid]);

        if ($invite == null){
            return $this->json(["result" => "error", "error" => "Invite doesn't exist or has expired"], 400);
        }

        if (new DateTimeImmutable() >= $invite->getExpDate()){
            return $this->json(["result" => "error", "error" => "Invite doesn't exist or has expired"], 400);
        }


        return $this->json(["result" => "success","used" => $invite->getUsed()]);
    }

    #[Route('/create', name: 'invite_create', methods: ["GET"])]
    public function create(Request $request, AuthService $authService, EntityManagerInterface $em, UserRepository $userRepository, SerializerInterface $serializerInterface){
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

        $user = $userRepository->findOneBy(["id" => $userData["user_id"]]);

        if ($user == null){
            return $this->json(["result" => "error","error" => "Access denied"], 401);
        }

        $expDateTime = new DateTimeImmutable();
        $expDateTime = $expDateTime->modify("+30 days");

        $invite = new RegisterInvite();
        $invite->setCreator($user);
        $invite->setCreatedAt(new DateTimeImmutable());
        $invite->setExpDate($expDateTime);
        $invite->setUid(str_replace("-", "", Uuid::v4()));

        $em->persist($invite);
        $em->flush();


        $jsonResult = $serializerInterface->serialize($invite, 'json', ['groups' => "classic"]);
        return $this->json(["result" => "success", "invite" => json_decode($jsonResult)]);
    }
}
