<?php

namespace App\Repository;

use App\Entity\WaitingUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method WaitingUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method WaitingUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method WaitingUser[]    findAll()
 * @method WaitingUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WaitingUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WaitingUser::class);
    }


    /**
     * @return WaitingUser[] Returns an array of WaitingUser objects
     */
    public function findByName($name)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.name = :name')
            ->setParameter('name', $name)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(100000)
            ->getQuery()
            ->getResult()
        ;
    }
    

    // /**
    //  * @return WaitingUser[] Returns an array of WaitingUser objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */
    

    //get the points within a kilometer radius  close to a point in ZA WARUDO
    public function findInRadius(float $givenLongitude ,float  $givenLatitude, float $radiusKm, int $thatmuch = 5, string $destination )
    {
        $conn = $this->getEntityManager()
            ->getConnection();
    
        $sql2 =' SELECT *
        FROM (
       SELECT w.*,
              p.radius,
              p.distance_unit
                       * DEGREES(ACOS(GREATEST(1.0, COS(RADIANS(p.latpoint))
                       * COS(RADIANS(w.latitude))
                       * COS(RADIANS(p.longpoint - w.longitude))
                       + SIN(RADIANS(p.latpoint))
                       * SIN(RADIANS(w.latitude))))) AS distance
        FROM waiting_user AS w
        JOIN (
              SELECT  :latitude  AS latpoint,  :longitude AS longpoint,
                      :radiusInKm AS radius,      111.045 AS distance_unit
          ) AS p ON 1=1
        WHERE w.latitude
           BETWEEN p.latpoint  - (p.radius / p.distance_unit)
               AND p.latpoint  + (p.radius / p.distance_unit)
          AND w.longitude
           BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
               AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
          AND w.destination = :destination
       ) AS d
       WHERE distance <= radius
       ORDER BY distance
       LIMIT '.$thatmuch;


        $stmt = $conn->prepare($sql2);
        $stmt->execute(array(
            'latitude' => $givenLatitude,
            'longitude' => $givenLongitude,
            'radiusInKm' => $radiusKm,
            'destination' => $destination
        ));
        return $stmt->fetchAll();
    }




    /*
    public function findOneBySomeField($value): ?WaitingUser
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
