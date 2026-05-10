<?php

namespace App\Entity;

use App\Repository\ConfigRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ORM\Entity(repositoryClass: ConfigRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['config:read']],
    denormalizationContext: ['groups' => ['config:write']],
    operations: [
        new Get(),
        new Patch(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Config
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['config:read'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?bool $needLogin = null;

    #[ORM\ManyToOne]
    #[Groups(['config:read', 'config:write'])]
    private ?MediaObject $bannerPhoto = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNeedLogin(): ?bool
    {
        return $this->needLogin;
    }

    public function setNeedLogin(?bool $needLogin): static
    {
        $this->needLogin = $needLogin;

        return $this;
    }

    public function getBannerPhoto(): ?MediaObject
    {
        return $this->bannerPhoto;
    }

    public function setBannerPhoto(?MediaObject $bannerPhoto): static
    {
        $this->bannerPhoto = $bannerPhoto;

        return $this;
    }
}
