<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Entity\MediaObject;
use App\Service\S3Service;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class MediaObjectSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly ParameterBagInterface $parameterBag,
        private readonly S3Service $s3Service,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postRemove,
        ];
    }

    public function postPersist(PostPersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof MediaObject) {
            return;
        }

        if (null === $entity->getImageName()) {
            $this->logger->error('MediaObjectSubscriber postPersist', [$entity]);

            return;
        }

        $filePath = $this->parameterBag->get('public_dir')."/upload/{$entity->getImageName()}";
        $this->s3Service->sendFile(
            $entity->getImageName(),
            $filePath
        );
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof MediaObject) {
            return;
        }

        if (null === $entity->getImageName()) {
            $this->logger->error('MediaObjectSubscriber postRemove', [$entity]);

            return;
        }

        $this->s3Service->deleteFile($entity->getImageName());
    }
}
