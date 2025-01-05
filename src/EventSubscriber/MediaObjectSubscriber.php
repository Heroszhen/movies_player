<?php

namespace App\EventSubscriber;

use Doctrine\ORM\Events;
use Psr\Log\LoggerInterface;
use Doctrine\Common\EventSubscriber;
use App\Entity\MediaObject;
use App\Service\S3Service;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;

class MediaObjectSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $parameterBag,
        private readonly Filesystem $filesystem,
        private readonly S3Service $s3Service
    )
    {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postRemove
        ];
    }

    public function postPersist(PostPersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof MediaObject) {
            return;
        }

        // $filePath = $this->parameterBag->get('public_dir') . "/upload/{$entity->getImageName()}";
        // $result = $this->s3Service->sendFile(
        //     $entity->getImageName(),
        //     $filePath
        // );
        // if (isset($result['ObjectURL']) && $this->filesystem->exists($filePath)) {
        //     //$this->filesystem->remove($filePath);
        // }
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        // if (!$entity instanceof MediaObject) {
        //     return;
        // }
        $this->logger->info("zhen-remove : {$entity->getImageName()}");
    }
}
