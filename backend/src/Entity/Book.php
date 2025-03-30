<?php

namespace App\Entity;

use App\Repository\BookRepository;
use BookStatus;
use BookType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\MaxDepth;

#[ORM\Entity(repositoryClass: BookRepository::class)]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['classic', 'rating'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['classic', 'rating'])]
    private ?string $name = null;

    #[ORM\Column(length: 1000, nullable: true)]
    #[Groups(['classic', 'rating'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['classic', 'rating'])]
    private ?string $image_path = null;

    #[ORM\Column]
    #[Groups(['classic', 'rating'])]
    private ?bool $is_active = null;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class)]
    #[Groups(['classic', 'rating'])]
    private Collection $tags;

    /**
     * @var Collection<int, Rating>
     */
    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'book', orphanRemoval: true)]
    #[MaxDepth(1)]
    #[Groups(['classic'])]
    private Collection $ratings;

    #[ORM\Column]
    #[Groups(['classic', 'rating'])]
    private ?BookStatus $status = null;

    #[ORM\Column]
    #[Groups(['classic', 'rating'])]
    private ?BookType $bookType = null;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->ratings = new ArrayCollection();
        $this->Comment = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getImagePath(): ?string
    {
        return $this->image_path;
    }

    public function setImagePath(string $image_path): static
    {
        $this->image_path = $image_path;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): static
    {
        $this->is_active = $is_active;

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    /**
     * @return Collection<int, Rating>
     */
    public function getRatings(): Collection
    {
        return $this->ratings;
    }

    public function addRating(Rating $rating): static
    {
        if (!$this->ratings->contains($rating)) {
            $this->ratings->add($rating);
            $rating->setBook($this);
        }

        return $this;
    }

    public function removeRating(Rating $rating): static
    {
        if ($this->ratings->removeElement($rating)) {
            // set the owning side to null (unless already changed)
            if ($rating->getBook() === $this) {
                $rating->setBook(null);
            }
        }

        return $this;
    }

    public function getBookStatus(): ?BookStatus
    {
        return $this->status;
    }

    public function setBookStatus(?BookStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getBookType(): ?BookType
    {
        return $this->bookType;
    }

    public function setBookType(?BookType $bookType): static
    {
        $this->bookType = $bookType;

        return $this;
    }
}
