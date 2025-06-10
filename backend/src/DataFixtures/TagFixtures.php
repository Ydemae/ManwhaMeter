<?php

namespace App\DataFixtures;

use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TagFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        {
            $tagList = [
                [
                    "label" => "action",
                ],
                [
                    "label" => "romance",
                ],
                [
                    "label" => "fantasy",
                ],
                [
                    "label" => "isekai",
                ],
                [
                    "label" => "regression",
                ],
                [
                    "label" => "thriller",
                ],
                [
                    "label" => "mistery",
                ],
                [
                    "label" => "supernatural",
                ],
            ];
        
            foreach ($tagList as $tag) {
                $createdTag = new Tag();
                $createdTag->setLabel($tag["label"]);
                $createdTag->setIsActive(true);
    
                $manager->persist($createdTag);

                $this->addReference("TAG_" . $tag["label"], $createdTag);
            }
            
    
            $manager->flush();
        }
    }
}
