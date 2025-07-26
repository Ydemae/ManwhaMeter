<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Repository;

use App\Entity\Rating;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @extends ServiceEntityRepository<Rating>
 */
class RatingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Rating::class);
    }

    public function has_rated_book(int $userId = null, int $bookId = null): bool{
        if ($userId == null){
            throw new Exception("No userId provided for has_rated_book method");
        }
        if ($bookId == null){
            throw new Exception("No bookId provided for has_rated_book method");
        }

        $result = $this->createQueryBuilder("r")
        ->leftJoin("r.book", "b")
        ->leftJoin("r.app_user", "u")
        ->andWhere("b.id = :bookId")
        ->andWhere("u.id = :usrId")
        ->setParameter("bookId", $bookId)
        ->setParameter("usrId", $userId)
        ->select("COUNT(r.id)")
        ->getQuery()
        ->getSingleScalarResult();

        return $result == 1;
    }

    //    /**
    //     * @return Rating[] Returns an array of Rating objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Rating
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
