<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Entity;

use App\Repository\ReadingListEntryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReadingListEntryRepository::class)]
class ReadingListEntry
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'readingListEntries')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'readingListEntries')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['classic', 'admin', 'unlogged'])]
    private ?Book $book = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): static
    {
        $this->book = $book;

        return $this;
    }
}
