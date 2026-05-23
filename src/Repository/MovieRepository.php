<?php

namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Movie>
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    //    /**
    //     * @return Movie[] Returns an array of Movie objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Movie
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function getMoviesByCategories(array $categories, ?string $keywords, int $page)
    {
        $qb = $this->createQueryBuilder('movie');

        $qb
            ->distinct()
            ->setFirstResult(($page - 1) * 20)
            ->setMaxResults(20)
            ->orderBy('movie.id', 'DESC')
        ;

        if (count($categories) > 0) {
            $qb
                ->innerJoin('movie.categories', 'categories')
                ->andWhere('categories.id IN (:categories)')
                ->setParameter('categories', $categories)
            ;
        }

        if (!empty($keywords)) {
            $qb
                ->innerJoin('movie.actors', 'actors')
                ->andWhere(
                    $qb->expr()->orX(
                        'movie.title LIKE :search',
                        'actors.name LIKE :search',
                        'actors.country LIKE :search'
                    )
                )
                ->setParameter('search', "%{$keywords}%");
        }

        return $qb;
    }
}
