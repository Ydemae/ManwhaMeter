<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Rating;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class RatingFixtures extends Fixture implements DependentFixtureInterface
{

    public function getDependencies(): array{
        return [
            UserFixtures::class,
            BookFixtures::class
        ];
    }

    public function load(ObjectManager $manager): void
    {
        {
            $RatingList = [
                [
                    "feeling" => 20,
                    "art_style" => 15,
                    "story" => 20,
                    "characters" =>10,
                    "book" => $this->getReference("BOOK_Chrysalis", Book::class),
                    "user" => $this->getReference("USER_admin", User::class),
                    "comment" => "A good book, I recommend",
                ],
                [
                    "feeling" => 10,
                    "art_style" => 15,
                    "story" => 6,
                    "characters" =>8,
                    "book" => $this->getReference("BOOK_Chrysalis", Book::class),
                    "user" => $this->getReference("USER_user", User::class),
                    "comment" => "didn't really enjoy it, it's a bit repetitive",
                ],
                [
                    "feeling" => 10,
                    "art_style" => 10,
                    "story" => 10,
                    "characters" =>10,
                    "book" => $this->getReference("BOOK_solo leveling", Book::class),
                    "user" => $this->getReference("USER_user", User::class),
                    "comment" => "I think it's average because I don't recognise good things"
                ],
                [
                    "feeling" => 10,
                    "art_style" => 15,
                    "story" => 15,
                    "characters" =>25,
                    "book" => $this->getReference("BOOK_The novel’s extra", Book::class),
                    "user" => $this->getReference("USER_admin", User::class),
                    "comment" => "Good"
                ],
            ];
        
           foreach ($RatingList as $rating) {
                $createdRating = new Rating();
                $createdRating->setCharacters($rating["characters"]);
                $createdRating->setArtStyle($rating["art_style"]);
                $createdRating->setFeeling($rating["feeling"]);
                $createdRating->setStory($rating["story"]);
                $createdRating->setBook($rating["book"]);
                $createdRating->setUser($rating["user"]);
                $createdRating->setComment($rating["comment"]);
    
                $manager->persist($createdRating);
            }
            
    
            $manager->flush();
        }
    }
}
