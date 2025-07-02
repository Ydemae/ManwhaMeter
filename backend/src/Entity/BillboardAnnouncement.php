<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Entity;

use App\Repository\BillboardAnnouncementRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BillboardAnnouncementRepository::class)]
class BillboardAnnouncement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['classic', 'admin'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 10000)]
    #[Groups(['classic', 'admin'])]
    private ?string $message = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin'])]
    private ?bool $active = null;

    #[ORM\Column(length: 255)]
    #[Groups(['classic', 'admin'])]
    private ?string $title = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }
}
