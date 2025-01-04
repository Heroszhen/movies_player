<?php

namespace App\EventSubscriber;

use Doctrine\ORM\Events;
use Psr\Log\LoggerInterface;
use Doctrine\Common\EventSubscriber;
use App\Entity\MediaObject;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;

class MediaObjectSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $parameterBag,
        private readonly Filesystem $filesystem
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
        // if (!$entity instanceof MediaObject) {
        //     return;
        // }

        $this->logger->info("zhen-post : {$entity->getImageName()}");
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
