<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Actor;
use App\Entity\Config;
use App\Entity\Movie;
use App\Entity\User;
use App\Repository\ConfigRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Hhxsv5\SSE\Event;
use Hhxsv5\SSE\SSE;
use Hhxsv5\SSE\StopSSEException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api')]
class ApiController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ConfigRepository $configRepository,
        private readonly UserRepository $userRepository,
    ) {
    }

    #[Route('/counts', name: 'app_counts')]
    public function index(): Response
    {
        $movies = $this->entityManager->getRepository(Movie::class)->findAll();
        $actors = $this->entityManager->getRepository(Actor::class)->findAll();
        $users = $this->entityManager->getRepository(User::class)->findAll();

        return $this->json([
            'status' => Response::HTTP_OK,
            'data' => [
                'movies' => count($movies),
                'actors' => count($actors),
                'users' => count($users),
            ],
        ], Response::HTTP_OK);
    }

    #[Route('/public-auth', name: 'app_public_auth', methods: 'GET')]
    public function getPublicAuth(JWTTokenManagerInterface $jwtManager): Response
    {
        $config = $this->configRepository->find(1);
        if (!$config instanceof Config) {
            throw new \Exception('Error');
        }

        if ($config->getNeedLogin()) {
            throw new AccessDeniedException();
        }

        $user = $this->userRepository->findOneBy(['isPublic' => true]);
        if (!$user instanceof User) {
            throw new \Exception('Error');
        }

        $token = $jwtManager->create($user);

        return $this->json([
            'status' => Response::HTTP_OK,
            'token' => $token,
        ], Response::HTTP_OK);
    }

    #[Route('/sse', name: 'app_sse')]
    public function sse(Request $request): Response
    {
        $em = $this->entityManager;

        $response = new StreamedResponse();
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no'); // Nginx: unbuffered responses suitable for Comet and HTTP streaming applications
        $response->setCallback(function () use ($em) {
            $callback = function () use ($em) {
                set_time_limit(0);
                /*
                $shouldStop = false; // Stop if something happens or to clear connection, browser will retry
                if ($shouldStop) {
                    throw new StopSSEException();
                }*/

                $movies = $em->getRepository(Movie::class)->findBy(['notified' => null]);
                foreach ($movies as $movie) {
                    /* @var Movie $movie */
                    $movie->setNotified(true);
                }

                $em->flush();

                if (0 < count($movies)) {
                    return json_encode(['videos' => array_map(fn (Movie $movie): string => $movie->getTitle() ?? '', $movies)]);
                } else {
                    flush();
                    ob_flush();
                }
                sleep(5);
            };
            (new SSE(new Event($callback, 'new_videos')))->start();
        });

        return $response;
    }
}
