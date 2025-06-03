<?php

namespace App\Repository;

use App\Entity\BillboardAnnouncement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BillboardAnnouncement>
 */
class BillboardAnnouncementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BillboardAnnouncement::class);
    }

    public function getAllActive(): array{

        $res = $this->createQueryBuilder("b")
        ->andwhere("b.active = 1")
        ->orderBy("b.createdAt", "DESC")
        ->getQuery()
        ->getResult();

        return $res;
    }


    //    /**
    //     * @return BillboardAnnouncement[] Returns an array of BillboardAnnouncement objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?BillboardAnnouncement
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
