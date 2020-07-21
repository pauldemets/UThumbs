<?php
///https://www.thinktocode.com/2018/03/26/symfony-4-rest-api-part-1-fosrestbundle/
namespace App\Controller\Rest;  
//Business
use App\Entity\Location;



class LocationService 
{
 
    private $locationRepository;
    public function __construct()
    {
        $this->locationRepository = $this->getDoctrine()->getRepository(Location::class);
    }   
    public function getLocation(int $locationId): ?Location
    {
        return $this->locationRepository->findById($locationId);
    }
    public function getAllLocations(): ?array
    {
        return $this->locationRepository->findAll();
    }
    public function addLocation(string $name, float $latitude, float $longitude): Location
    {
        $location = new Location();
        $location->setName($name);
        $location->setLongitude($longitude);
        $location->setLatitude($latitude);
        $this->locationRepository->save($location);
        return $location;
    }
    public function updateLocation(int $locationId,string $name, float $latitude, float $longitude): ?Location
    {
        $location = $this->locationRepository->findById($locationId);
        if (!$location) {
            return null;
        }
        $location->setName($name);
        $location->setLongitude($longitude);
        $location->setLatitude($latitude);
        $this->locationRepository->save($location);
        return $location;
    }
    public function deleteLocation(int $locationId): void
    {
        $location = $this->locationRepository->findById($locationId);
        if ($location) {
            $this->locationRepository->delete($location);
        }
    }
}