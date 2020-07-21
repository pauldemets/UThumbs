<?php

namespace App\Repository;
//Business
use App\Entity\Location;

/**
 * Interface LocationRepositoryInterface
 * @package App\Domain\Model\Location
 */
interface LocationRepositoryInterface
{

    /**
     * @param int $locationId
     * @return Location
     */
    public function findById(int $locationId): ?Location;

    /**
     * @return array
     */
    public function findAll(): array;

    /**
     * @param Location $location
     */
    public function save(Location $location): void;

    /**
     * @param Location $location
     */
    public function delete(Location $location): void;

}