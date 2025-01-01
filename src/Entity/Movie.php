<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use App\Repository\MovieRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MovieRepository::class)]
class Movie
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $releasedAt = null;

    #[ORM\Column(nullable: true)]
    private ?int $duration = null;

    #[ORM\ManyToOne]
    private ?VideoType $type = null;

    #[ORM\ManyToOne]
    private ?MediaObject $poster = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getReleasedAt(): ?\DateTimeInterface
    {
        return $this->releasedAt;
    }

    public function setReleasedAt(?\DateTimeInterface $releasedAt): static
    {
        $this->releasedAt = $releasedAt;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getType(): ?VideoType
    {
        return $this->type;
    }

    public function setType(?VideoType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPoster(): ?MediaObject
    {
        return $this->poster;
    }

    public function setPoster(?MediaObject $poster): static
    {
        $this->poster = $poster;

        return $this;
    }
}
