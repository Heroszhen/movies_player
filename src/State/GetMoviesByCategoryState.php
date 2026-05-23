<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\MovieRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

class GetMoviesByCategoryState implements ProviderInterface
{
    public function __construct(
        private readonly MovieRepository $movieRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Paginator
    {
        $filters = $context['filters'] ?? [];
        $page = $filters['page'] ? (int) $filters['page'] : 1;
        $keywords = $filters['keywords'] ?? null;

        $qb = $this->movieRepository->getMoviesByCategories($filters['categories'] ?? [], $keywords, $page);

        return new Paginator($qb->getQuery());
    }
}
