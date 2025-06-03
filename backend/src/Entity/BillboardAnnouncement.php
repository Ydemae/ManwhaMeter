<?php

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
    #[Groups(['admin'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 10000)]
    #[Groups(['classic', 'admin'])]
    private ?string $announcementMessage = null;

    #[ORM\Column]
    #[Groups(['classic', 'admin'])]
    private ?bool $active = null;

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

    public function getAnnouncementMessage(): ?string
    {
        return $this->announcementMessage;
    }

    public function setAnnouncementMessage(string $announcementMessage): static
    {
        $this->announcementMessage = $announcementMessage;

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
}
