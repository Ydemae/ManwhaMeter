<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Tag;
use App\enum\BookStatus;
use App\enum\BookType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class BookFixtures extends Fixture implements DependentFixtureInterface
{


    public function getDependencies(): array{
        return [
            TagFixtures::class
        ];
    }

    public function load(ObjectManager $manager): void
    {
        {
            $bookList = [
                [
                    "name" => "solo leveling",
                    "description" => "In a world where hunters, human warriors who possess magical abilities, must battle deadly monsters to protect mankind from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival. One day, after narrowly surviving an overwhelmingly powerful dungeon that nearly wipes out his entire party, a mysterious program called the System chooses him as its sole player and in turn, gives him the extremely rare ability to level up in strength, possibly beyond any known limits. Follow Jinwoo's journey as he fights against all kinds of enemies, both man and monster, to discover the secrets of the dungeons and the true source of his powers.",
                    "image_path" => "solo_leveling.jpg",
                    "status" => BookStatus::COMPLETED,
                    "type" => BookType::WEBTOON,
                    "tags" => [
                        $this->getReference("TAG_action", Tag::class),
                        $this->getReference("TAG_supernatural", Tag::class),
                    ],
                ],
                [
                    "name" => "The novel’s extra",
                    "description" => "Waking up, Kim Hajin finds himself in a familiar world but an unfamiliar body. A world he created himself and a story he wrote, yet never finished. He had become his novel’s extra, a filler character with no importance to the story. The only clue to escaping is to stay close to the main storyline. However, he soon finds out the world isn’t exactly identical to his creation.",
                    "image_path" => "novel_extra.jpg",
                    "status" => BookStatus::ONGOING,
                    "type" => BookType::WEBTOON,
                    "tags" => [
                        $this->getReference("TAG_action", Tag::class),
                        $this->getReference("TAG_supernatural", Tag::class),
                        $this->getReference("TAG_romance", Tag::class),
                    ],
                ],
                [
                    "name" => "Chrysalis",
                    "description" => "Anthony has been reborn! Placed into the remarkable game-like world of Pangera. However, something seems a little off. What's with these skills? Bite? Dig? Wait.... I've been reborn as a WHAT?!",
                    "image_path" => "chrysalis.jpg",
                    "status" => BookStatus::ONGOING,
                    "type" => BookType::NOVEL,
                    "tags" => [
                        $this->getReference("TAG_action", Tag::class),
                        $this->getReference("TAG_fantasy", Tag::class),
                    ],
                ],
            ];
    
    
            foreach ($bookList as $book) {
                $createdbook = new Book();
                $createdbook->setName($book["name"]);
                $createdbook->setDescription($book["description"]);
                $createdbook->setImagePath($book["image_path"]);
                $createdbook->setStatus($book["status"]);
                $createdbook->setBookType($book["type"]);
                $createdbook->setIsActive(true);
                
                foreach($book["tags"] as $tag){
                    $createdbook->addTag($tag);
                }
    
                
                $manager->persist($createdbook);

                $this->addReference("BOOK_".$book["name"], $createdbook);
            }
            
            $manager->flush();
        }
    }
}
