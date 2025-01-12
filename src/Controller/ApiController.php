<?php

namespace App\Controller;

use App\Entity\Actor;
use App\Entity\Movie;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ApiController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    )
    {}

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
                'users' => count($users)
            ]
        ], Response::HTTP_OK);
    }
}
