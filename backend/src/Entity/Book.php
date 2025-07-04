<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Entity;

use App\enum\BookStatus;
use App\enum\BookType;
use App\Repository\BookRepository;
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
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?string $name = null;

    #[ORM\Column(length: 1000, nullable: true)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?string $image_path = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?bool $is_active = null;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private Collection $tags;

    /**
     * @var Collection<int, Rating>
     */
    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'book', orphanRemoval: true)]
    #[MaxDepth(1)]
    #[Groups(['classic', 'admin'])]
    private Collection $ratings;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?BookStatus $status = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?BookType $bookType = null;

    /**
     * @var Collection<int, BookReport>
     */
    #[ORM\OneToMany(targetEntity: BookReport::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $bookReports;

    /**
     * @var Collection<int, ReadingListEntry>
     */
    #[ORM\OneToMany(targetEntity: ReadingListEntry::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $readingListEntries;

    #[ORM\ManyToOne(inversedBy: 'books')]
    private ?User $creator = null;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->ratings = new ArrayCollection();
        $this->Comment = new ArrayCollection();
        $this->bookReports = new ArrayCollection();
        $this->readingListEntries = new ArrayCollection();
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

    public function getStatus(): ?BookStatus
    {
        return $this->status;
    }

    public function setStatus(?BookStatus $status): static
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

    /**
     * @return Collection<int, BookReport>
     */
    public function getBookReports(): Collection
    {
        return $this->bookReports;
    }

    public function addBookReport(BookReport $bookReport): static
    {
        if (!$this->bookReports->contains($bookReport)) {
            $this->bookReports->add($bookReport);
            $bookReport->setBook($this);
        }

        return $this;
    }

    public function removeBookReport(BookReport $bookReport): static
    {
        if ($this->bookReports->removeElement($bookReport)) {
            // set the owning side to null (unless already changed)
            if ($bookReport->getBook() === $this) {
                $bookReport->setBook(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ReadingListEntry>
     */
    public function getReadingListEntries(): Collection
    {
        return $this->readingListEntries;
    }

    public function addReadingListEntry(ReadingListEntry $readingListEntry): static
    {
        if (!$this->readingListEntries->contains($readingListEntry)) {
            $this->readingListEntries->add($readingListEntry);
            $readingListEntry->setBook($this);
        }

        return $this;
    }

    public function removeReadingListEntry(ReadingListEntry $readingListEntry): static
    {
        if ($this->readingListEntries->removeElement($readingListEntry)) {
            // set the owning side to null (unless already changed)
            if ($readingListEntry->getBook() === $this) {
                $readingListEntry->setBook(null);
            }
        }

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }
}
