<?php

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class KernelTerminateListener
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $parameterBag,
        private readonly Filesystem $filesystem
    )
    {}

    #[AsEventListener(event: KernelEvents::TERMINATE)]
    public function onKernelTerminate(TerminateEvent $event): void
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        if (Request::METHOD_POST === $request->getMethod() && 
            '/api/media_objects' === $request->getPathInfo() && 
            Response::HTTP_CREATED === $response->getStatusCode()
        ) {
            $content = json_decode($response->getContent(), true);
            if (isset($content['imageName'])) {
                $filePath = $this->parameterBag->get('public_dir') . '/upload/' . $content['imageName']; 
                if ($this->filesystem->exists($filePath)) {
                    $this->filesystem->remove($filePath);
                }
            }
        }
    }
}
