<?php

namespace App\Controller;

use App\Encoder\MultipartDecoder;
use App\Entity\MediaObject;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __construct(
        private readonly MultipartDecoder $multipartDecoder,
        private readonly EntityManagerInterface $entityManager
    )
    {}

    public function __invoke(Request $request): MediaObject
    {
        $uploadedFile = $request->files->get('imageFile');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"imageFile" is required');
        }

        $data = $this->multipartDecoder->decode($request->getContent(), 'multipart');

        $mediaObject = new MediaObject();
        $mediaObject->setImageFile(new File($data['imageFile']));
        
        $this->entityManager->persist($mediaObject);
        $this->entityManager->flush();

        return $mediaObject;
    }
}