<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Traits\TimestampableTrait;
use App\Repository\MovieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\QueryParameter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MovieRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['movie:read']],
    denormalizationContext: ['groups' => ['movie:write']],
    operations: [
        new GetCollection(
            paginationEnabled: true, 
            paginationItemsPerPage: 4,
            name: 'get_last_three_movies', 
            uriTemplate: '/movies/last-three-movies', 
            order: ['id' => 'DESC']
        ),
        new GetCollection(
            name: 'get_movies_poster', 
            uriTemplate: '/movies/poster', 
            order: ['id' => 'DESC'],
            normalizationContext: ['groups' => 'movie:poster']
        ),
        new GetCollection(
            name: 'get_movies_by_actor', 
            uriTemplate: '/movies/actor', 
            order: ['createdAt' => 'DESC'],
            parameters: [
                'actors.id' => new QueryParameter(
                    required: true,
                    key: 'actors.id',
                    schema: ['type' => 'integer']
                )
            ],
            normalizationContext: ['groups' => 'movie:poster']
        ),
        new Get(),
        new GetCollection(
            order: ['id' => 'DESC']
        ),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'ipartial', 'actors.name' => 'ipartial', 'actors.id' => 'exact'])]
class Movie
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['movie:read', 'movie:poster'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank]
    #[Groups(['movie:read', 'movie:poster', 'movie:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?\DateTimeInterface $releasedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['movie:read', 'movie:poster', 'movie:write'])]
    private ?int $duration = null;

    #[ORM\ManyToOne]
    #[Assert\NotBlank]
    #[Groups(['movie:read', 'movie:write'])]
    private ?VideoType $type = null;

    #[ORM\ManyToOne]
    #[Groups(['movie:read', 'movie:poster', 'movie:write'])]
    private ?MediaObject $poster = null;

    /**
     * @var Collection<int, Actor>
     */
    #[ORM\ManyToMany(targetEntity: Actor::class, inversedBy: 'movies')]
    #[Groups(['movie:read', 'movie:write'])]
    private Collection $actors;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?string $link = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?string $description = null;

    public function __construct()
    {
        $this->actors = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Actor>
     */
    public function getActors(): Collection
    {
        return $this->actors;
    }

    public function addActor(Actor $actor): static
    {
        if (!$this->actors->contains($actor)) {
            $this->actors->add($actor);
        }

        return $this;
    }

    public function removeActor(Actor $actor): static
    {
        $this->actors->removeElement($actor);

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): static
    {
        $this->link = $link;

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
}
