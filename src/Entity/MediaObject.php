<?php

namespace App\Entity;

use App\Repository\MediaObjectRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use App\Controller\CreateMediaObjectAction;
use App\Entity\Traits\TimestampableTrait;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: MediaObjectRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['media_object:read']], 
    denormalizationContext: ['groups' => ['media_object:write']], 
    outputFormats: ['jsonld' => ['application/ld+json']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']],
            // controller: CreateMediaObjectAction::class,
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object', 
                                'properties' => [
                                    'imageFile' => [
                                        'type' => 'string', 
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        )
    ]
)]
class MediaObject
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media_object:read'])]
    private ?int $id = null;

    #[Vich\UploadableField(mapping: 'media_object', fileNameProperty: 'imageName', size: 'imageSize', originalName: 'originalName')]
    #[Groups(['media_object:write'])]
    #[Assert\File(
        mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
        mimeTypesMessage: 'Please upload a valid image (png, jpeg, or jpg).'
    )]
    private ?File $imageFile = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['media_object:read'])]
    private ?string $imageName = null;

    #[ORM\Column(nullable: true)]
    private ?int $imageSize = null;

    #[ORM\Column(nullable: true)]
    private ?string $originalName = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setImageFile(?File $imageFile = null): static
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTime();
        }

        return $this;
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageName(?string $imageName): static
    {
        $this->imageName = $imageName;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageSize(?int $imageSize): static
    {
        $this->imageSize = $imageSize;

        return $this;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function setOriginalName(?string $originalName): static
    {
        $this->originalName = $originalName;

        return $this;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }
}
