<?php

namespace App\Controller\Rest;
//Business
use App\Entity\Ride;
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



class RideController  extends FOSRestController
{
    /**
     * Creates an Ride resource
     * @Rest\Post("/rides")
     * @param Request $request
     * @return View 
     */
    public function postRide(Request $request): View
    {
        //encode/decode 
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);


        $ride = new Ride();
        $okaydumper =  $request->getContent();
        $ride = $serializer->deserialize($okaydumper, Ride::class, 'json');
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($ride);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();
        return View::create($ride, Response::HTTP_CREATED);
    }

    /**
     * Retrieves a collection of Ride resource
     * @Rest\Get("/rides")
     */
    public function getRides(): View
    {
        $repository = $this->getDoctrine()->getRepository(Ride::class);
        $rides =  $repository->findAll();

        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of article object
        return View::create($rides, Response::HTTP_OK);
    }

    /**
     * Retrieves an Ride resource
     * @Rest\Get("/rides/{rideId}")
     */
    public function getRide(int $rideId): View
    {
        $repository = $this->getDoctrine()->getRepository(Ride::class);
        $ride = $repository->findById($rideId);
        // In case our GET was a success we need to return a 200 HTTP OK response with the request object
        return View::create($ride, Response::HTTP_OK);
    }
    /**
     * Replaces Ride resource
     * @Rest\Put("/rides/{rideId}")
     */
    public function putRide(int $rideId, Request $request): View
    {
        $repository = $this->getDoctrine()->getRepository(Ride::class);
        $ride = $repository->findById($rideId);
        if ($ride) {
            //encode/decode 
            $encoders = [new XmlEncoder(), new JsonEncoder()];
            $normalizers = [new ObjectNormalizer()];
            $serializer = new Serializer($normalizers, $encoders);
            $jsonContent = $request->getContent();;
            $ride = $serializer->deserialize($jsonContent, Ride::class, 'json');

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($ride);
            $entityManager->flush();
        }
        // In case our PUT was a success we need to return a 200 HTTP OK response with the object as a result of PUT
        return View::create($ride, Response::HTTP_OK);
    }

    /**
     * Removes the Ride resource
     * @Rest\Delete("/rides/{rideId}")
     * @ParamConverter("ride", options={"mapping": {"rideId" : "id"}})
     */
    public function deleteLocation(Ride $ride): View
    {
        $repository = $this->getDoctrine()->getRepository(Ride::class);
        if ($ride) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($ride);
            $entityManager->flush();
        }
        // In case our DELETE was a success we need to return a 204 HTTP NO CONTENT response. The object is deleted.
        return View::create([], Response::HTTP_NO_CONTENT);
    }
}
