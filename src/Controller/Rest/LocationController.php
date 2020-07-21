<?php
///https://www.thinktocode.com/2018/03/26/symfony-4-rest-api-part-1-fosrestbundle/
namespace App\Controller\Rest;
//Business
use App\Entity\Location;
//Technical 
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class LocationController  extends FOSRestController
{


    /**
     * Creates an Location resource
     * @Rest\Post("/locations")
     * @param Request $request
     * @return View
     */
    public function postLocation(Request $request): View
    {
        $mediaType = $request->attributes->get('media_type');
        //encode/decode 
        dump($mediaType);
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $location = new Location();
        $jsonContent =  $request->getContent();
        $location = $serializer->deserialize($jsonContent, Location::class, 'json');
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($location);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();
        return View::create($location, Response::HTTP_CREATED);
    }

    /**
     * Retrieves a collection of Location resource
     * @Rest\Get("/locations")
     */
    public function getLocations(Request $request): View
    {
        $mediaType = $request->attributes->get('media_type');
        //encode/decode 
        dump($mediaType);
        $repository = $this->getDoctrine()->getRepository(Location::class);
        $locations =  $repository->findAll();

        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of location object
        return View::create($locations, Response::HTTP_OK);
    }

    /**
     * Retrieves an Location resource
     * @Rest\Get("/locations/{locationId}")
     */
    public function getLocation(int $locationId): View
    {
        $repository = $this->getDoctrine()->getRepository(Location::class);
        $location = $repository->findById($locationId);
        // In case our GET was a success we need to return a 200 HTTP OK response with the request object
        return View::create($location, Response::HTTP_OK);
    }
    /**
     * Replaces Location resource
     * @Rest\Put("/locations/{locationId}")
     */
    public function putLocation(int $locationId, Request $request): View
    {
        $repository = $this->getDoctrine()->getRepository(Location::class);
        $location = $repository->findById($locationId);
        if ($location) {
            //encode/decode 
            $encoders = [new XmlEncoder(), new JsonEncoder()];
            $normalizers = [new ObjectNormalizer()];
            $serializer = new Serializer($normalizers, $encoders);
            $jsonContent = $request->getContent();;
            $location = $serializer->deserialize($jsonContent, Location::class, 'json');

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($location);
            $entityManager->flush();
        }
        // In case our PUT was a success we need to return a 200 HTTP OK response with the object as a result of PUT
        return View::create($location, Response::HTTP_OK);
    }

    /**
     * Removes the Location resource
     * @Rest\Delete("/locations/{locationId}")
     * @ParamConverter("location", options={"mapping": {"locationId" : "id"}})
     */
    public function deleteLocation(Location $location): View
    {
        $repository = $this->getDoctrine()->getRepository(Location::class);
        if ($location) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($location);
            $entityManager->flush();
        }
        // In case our DELETE was a success we need to return a 204 HTTP NO CONTENT response. The object is deleted.
        return View::create([], Response::HTTP_NO_CONTENT);
    }

}
