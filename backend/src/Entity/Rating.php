<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Entity;

use App\Repository\RatingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\MaxDepth;

#[ORM\Entity(repositoryClass: RatingRepository::class)]
class Rating
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $story = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $feeling = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $characters = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $art_style = null;

    #[ORM\ManyToOne(inversedBy: 'ratings')]
    #[ORM\JoinColumn(nullable: false)]
    #[MaxDepth(1)]
    #[Groups(['admin'])]
    private ?Book $book = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[MaxDepth(1)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?User $user = null;

    #[ORM\Column(length: 6000, nullable: true)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?string $comment = null;

    /**
     * @var Collection<int, RatingReport>
     */
    #[ORM\OneToMany(targetEntity: RatingReport::class, mappedBy: 'rating', orphanRemoval: true)]
    private Collection $ratingReports;

    public function __construct()
    {
        $this->ratingReports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStory(): ?int
    {
        return $this->story;
    }

    public function setStory(int $story): static
    {
        if ($story > 25){
            throw new Exception("Story can't go over 25 (it's 25% of overall grade)");
        }
        $this->story = $story;

        return $this;
    }

    public function getFeeling(): ?int
    {
        return $this->feeling;
    }

    public function setFeeling(int $feeling): static
    {
        if ($feeling > 25){
            throw new Exception("Feeling can't go over 25 (it's 25% of overall grade)");
        }
        $this->feeling = $feeling;

        return $this;
    }

    public function getCharacters(): ?int
    {
        return $this->characters;
    }

    public function setCharacters(int $characters): static
    {
        if ($characters > 25){
            throw new Exception("Characters can't go over 25 (it's 25% of overall grade)");
        }
        $this->characters = $characters;

        return $this;
    }

    public function getArtStyle(): ?int
    {
        return $this->art_style;
    }

    public function setArtStyle(int $art_style): static
    {
        if ($art_style > 25){
            throw new Exception("Art style can't go over 25 (it's 25% of overall grade)");
        }
        $this->art_style = $art_style;

        return $this;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): static
    {
        $this->book = $book;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * @return Collection<int, RatingReport>
     */
    public function getRatingReports(): Collection
    {
        return $this->ratingReports;
    }

    public function addRatingReport(RatingReport $ratingReport): static
    {
        if (!$this->ratingReports->contains($ratingReport)) {
            $this->ratingReports->add($ratingReport);
            $ratingReport->setRating($this);
        }

        return $this;
    }

    public function removeRatingReport(RatingReport $ratingReport): static
    {
        if ($this->ratingReports->removeElement($ratingReport)) {
            // set the owning side to null (unless already changed)
            if ($ratingReport->getRating() === $this) {
                $ratingReport->setRating(null);
            }
        }

        return $this;
    }
}
