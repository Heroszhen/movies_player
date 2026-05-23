<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Actor;
use App\Entity\MediaObject;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/media_objects')]
class MediaObjectController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly SerializerInterface $serializer,
    ) {
    }

    #[Route('', name: 'media_objects_post', methods: ['POST'])]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

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
                /* @var ConstraintViolationInterface $error */
                $violations[] = [
                    'propertyPath' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                    'codez' => $error->getCode(),
                ];
            }

            return $this->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'violations' => $violations,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (!empty($request->request->get('actorId'))) {
            $actor = $this->entityManager->find(Actor::class, $request->request->get('actorId'));
            if ($actor instanceof Actor) {
                $mediaObject->setActor($actor);
            }
        }

        $this->entityManager->persist($mediaObject);
        $this->entityManager->flush();

        $serialized = $this->serializer->serialize($mediaObject, 'json', ['groups ' => ['media_object:read']]);
        $serialized = json_decode($serialized, true);
        unset($serialized['imageFile']);

        return $this->json(
            array_merge([
                '@context' => '/api/contexts/MediaObject',
                '@id' => "/api/media_objects/{$mediaObject->getId()}",
                '@type' => 'MediaObject',
            ], $serialized),
            Response::HTTP_CREATED
        );
    }
}
