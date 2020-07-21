<?php
https://drib.tech/programming/symfony-4-alice-3-tutorial

namespace App\DataFixtures\ORM;

use App\Entity\Location;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\ORMFixtureInterface;





abstract class LocationFixture extends BaseFixture   implements ORMFixtureInterface
{

    public function __construct()
    {
    }

    
    
    protected function loadData(ObjectManager $manager)
    {
     $this->createMany(10, Location::class, function (Location $location, $i) {

            $location->setName('Random' . $i);
            $location->setLatitude($i);
            $location->setLongitude($i);

            return $location;
        });

        $manager->flush();
    }

     /**
     * Creates an Ride resource
     * @Rest\Post("/rides")
     * @param Request $request
     * @return View
     */
    public function postRide(Request $request): View
    {
        $article = new Ride();
        $article->setPassengerRoom($request->get('passengerVolume'));
        $this->articleRepository->save($article);
        // In case our POST was a success we need to return a 201 HTTP CREATED response
        return View::create($article, Response::HTTP_CREATED);
    }


    
}
