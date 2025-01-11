<?php

namespace App\Controller;

use App\Entity\MediaObject;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/media_objects')]
class MediaObjectController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly SerializerInterface $serializer,
        private readonly HttpClientInterface $httpClient
    )
    {}

    #[Route('', name: 'media_objects_post', methods: ['POST'])]
    public function index(Request $request): Response
    {
        $uploadedFile = $request->files->get('imageFile');

        if (!$uploadedFile) {
            throw new BadRequestHttpException('"imageFile" is required');
        }
        
        $mediaObject = new MediaObject();
        $mediaObject->setImageFile($uploadedFile);
        
        $errors = $this->validator->validate($mediaObject);
        if (count($errors) > 0) {
            $violations = [];
            foreach ($errors as $error) {
                 /** @var ConstraintViolationInterface $error */
                 $violations[] = [
                    'propertyPath' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                    'codez' => $error->getCode(),
                ];
            }

            return $this->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'violations' => $violations
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->persist($mediaObject);
        $this->entityManager->flush();

        $serialized = $this->serializer->serialize($mediaObject, 'json', ['groups '=> ['media_object:read']]);
        $serialized = json_decode($serialized, true);
        unset($serialized['imageFile']);

        return $this->json(array_merge([
            "@context" => "/api/contexts/MediaObject",
            "@id" => "/api/media_object/{$mediaObject->getId()}",
            "@type" => "MediaObject",
        ], $serialized), 
        Response::HTTP_CREATED);
    }
}
