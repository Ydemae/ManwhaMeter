<?php

namespace App\DataFixtures;

use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;

class UserFixtures extends Fixture
{

    private PasswordHasherFactoryInterface $passwordHasherFactory;

    public function __construct(PasswordHasherFactoryInterface $passwordHasherFactory)
    {
        $this->passwordHasherFactory = $passwordHasherFactory;
    }

    public function load(ObjectManager $manager): void
    {
        {
            $userList = [
                [
                    "username" => "admin",
                    "password" => "admin",
                    "roles" => ["ROLE_USER", "ROLE_ADMIN"]
                ],
                [
                    "username" => "user",
                    "password" => "user",
                    "roles" => ["ROLE_USER"],
                ],
            ];
    
            $passwordHasher = $this->passwordHasherFactory->getPasswordHasher(User::class);
    
            foreach ($userList as $user) {
                $createdUser = new User();
                $createdUser->setUsername($user["username"]);
                $createdUser->setRoles($user["roles"]);
                $createdUser->setCreatedAt(new DateTimeImmutable());
    
                $hashedPassword = $passwordHasher->hash(
                    $user["password"]
                );
                $createdUser->setPassword($hashedPassword);
                $manager->persist($createdUser);

                $this->addReference("USER_".$user["username"], $createdUser);
            }
            
    
            $manager->flush();
        }
    }
}
