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

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news1Title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news1Content = null;

    #[ORM\ManyToOne]
    #[Groups(['config:read', 'config:write'])]
    private ?MediaObject $news1Photo = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news2Title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news2Content = null;

    #[ORM\ManyToOne]
    #[Groups(['config:read', 'config:write'])]
    private ?MediaObject $news2Photo = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news3Title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['config:read', 'config:write'])]
    private ?string $news3Content = null;

    #[ORM\ManyToOne]
    #[Groups(['config:read', 'config:write'])]
    private ?MediaObject $news3Photo = null;

    #[ORM\ManyToOne]
    #[Groups(['config:read', 'config:write'])]
    private ?MediaObject $loginGuidePhoto = null;

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

    public function getNews1Title(): ?string
    {
        return $this->news1Title;
    }

    public function setNews1Title(?string $news1Title): static
    {
        $this->news1Title = $news1Title;

        return $this;
    }

    public function getNews1Content(): ?string
    {
        return $this->news1Content;
    }

    public function setNews1Content(?string $news1Content): static
    {
        $this->news1Content = $news1Content;

        return $this;
    }

    public function getNews1Photo(): ?MediaObject
    {
        return $this->news1Photo;
    }

    public function setNews1Photo(?MediaObject $news1Photo): static
    {
        $this->news1Photo = $news1Photo;

        return $this;
    }

    public function getNews2Title(): ?string
    {
        return $this->news2Title;
    }

    public function setNews2Title(?string $news2Title): static
    {
        $this->news2Title = $news2Title;

        return $this;
    }

    public function getNews2Content(): ?string
    {
        return $this->news2Content;
    }

    public function setNews2Content(?string $news2Content): static
    {
        $this->news2Content = $news2Content;

        return $this;
    }

    public function getNews2Photo(): ?MediaObject
    {
        return $this->news2Photo;
    }

    public function setNews2Photo(?MediaObject $news2Photo): static
    {
        $this->news2Photo = $news2Photo;

        return $this;
    }

    public function getNews3Title(): ?string
    {
        return $this->news3Title;
    }

    public function setNews3Title(?string $news3Title): static
    {
        $this->news3Title = $news3Title;

        return $this;
    }

    public function getNews3Content(): ?string
    {
        return $this->news3Content;
    }

    public function setNews3Content(?string $news3Content): static
    {
        $this->news3Content = $news3Content;

        return $this;
    }

    public function getNews3Photo(): ?MediaObject
    {
        return $this->news3Photo;
    }

    public function setNews3Photo(?MediaObject $news3Photo): static
    {
        $this->news3Photo = $news3Photo;

        return $this;
    }

    public function getLoginGuidePhoto(): ?MediaObject
    {
        return $this->loginGuidePhoto;
    }

    public function setLoginGuidePhoto(?MediaObject $loginGuidePhoto): static
    {
        $this->loginGuidePhoto = $loginGuidePhoto;

        return $this;
    }
}
