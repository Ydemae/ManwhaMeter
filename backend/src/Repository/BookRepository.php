<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    public function getAllRanked(
        array $tags = [],
        ?string $bookType = null,
        string $bookName = "",
        string $orderBy = "DESC",
        ?int $userId = null,
        ?string $status = null,
        ?bool $active = null
        ): array{


        $query = $this->createQueryBuilder("b")
        ->leftJoin("b.ratings", "r")
        ->leftJoin("b.tags", "t");

        if ($userId != null){
            $query->leftJoin("r.user", 'u')
            ->andWhere("u.id = :userId")
            ->setParameter("userId", $userId);
        }

        if ($bookName != ""){
            $query->andWhere("LOWER(b.name) LIKE LOWER(:bookName)")
            ->setParameter("bookName", "%$bookName%");
        }

        if ($active !== null){
            $query->andWhere("b.is_active = :is_active")
            ->setParameter("is_active", $active);
        }

        if ($bookType != null){
            $query->andWhere("b.bookType = :booktype")
            ->setParameter("booktype", $bookType);
        }

        if ($status != null){
            $query->andWhere("b.status = :status")
            ->setParameter("status", $status);
        }

        if (!empty($tags)) {
            $query->andWhere("t.id IN (:tags)")
                ->setParameter("tags", $tags)
                ->groupBy("b.id")
                ->having("COUNT(DISTINCT t.id) >= :tagCount")
                ->setParameter("tagCount", count($tags));
        }
        else{
            $query->groupBy("b.id");
        }

        $query->select("
        b.id as id,
        SUM(r.story + r.characters + r.art_style + r.feeling)/Count(r.id) as overall_rating,
        b.name as bookName,
        b.description as bookDescription,
        b.bookType as bookType,
        b.image_path as image_name"
        )
        ->orderBy("overall_rating", $orderBy);


        $results = $query
        ->getQuery()
        ->getResult();

        $books = [];
        $bookIds = [];
        foreach ($results as $row) {
            $bookId = $row['id'];
            
            if (!isset($books[$bookId])) {
                $books[$bookId] = [
                    'id' => $row['id'],
                    'name' => $row['bookName'],
                    'description' => $row['bookDescription'],
                    'bookType' => $row['bookType'],
                    'image_path' => $row['image_name'],
                    'overall_rating' => $row['overall_rating'],
                    'tags' => []
                ];
                $bookIds[] = $bookId;
            }
        }

        if (!empty($bookIds)){
            $tagQuery = $this->createQueryBuilder("b")
            ->select("b.id as bookId, t.label as tag")
            ->leftJoin("b.tags", "t")
            ->where("b.id IN (:bookIds)")
            ->setParameter("bookIds", $bookIds)
            ->getQuery()
            ->getResult();

            foreach ($tagQuery as $tagRow) {
                $books[$tagRow['bookId']]['tags'][] = $tagRow['tag'];
            }
        }

        $returnedBooks = [];

        foreach ($books as $key => $value){
            $returnedBooks[] = $value;
        }


        return $returnedBooks;
    }

    //    /**
    //     * @return Book[] Returns an array of Book objects
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

    //    public function findOneBySomeField($value): ?Book
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
