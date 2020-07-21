<?php

namespace App\Controller\Rest;

//Business
use App\Entity\WaitingUser;
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


class WaitingUserController extends FOSRestController
{
    /**
     * Creates an WaitingUser resource
     * @Rest\Post("/waiting_user")
     * @param Request $request
     * @return View
     */
    public function postWaitingUser(Request $request): View
    {
        $mediaType = $request->attributes->get('media_type');

        //encode/decode 
        dump($mediaType);
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $waitingUser = new WaitingUser();
        $jsonContent =  $request->getContent();
        $waitingUser = $serializer->deserialize($jsonContent, WaitingUser::class, 'json');
        $waitingUser->setAcceptWalker(null);
        $waitingUser->setDeletableboolean(null);
        $waitingUser->setAcceptDriver(false);
        $waitingUser->setDriverName("");
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($waitingUser);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();
        return View::create($waitingUser, Response::HTTP_CREATED);
    }

    /**
     * Retrieves a collection of WaitingUser resource
     * @Rest\Get("/waiting_users")
     */
    public function getWaitingUsers(Request $request): View
    {
        $mediaType = $request->attributes->get('media_type');
        //encode/decode 
        dump($mediaType);
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUsers =  $repository->findAll();

        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of waitingUser object
        return View::create($waitingUsers, Response::HTTP_OK);
    }

    /**
     * Retrieves an WaitingUser resource
     * @Rest\Get("/waiting_users/{userId}")
     */
    public function getWaitingUser(int $userId): View
    {
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUser = $repository->findById($userId);
        // In case our GET was a success we need to return a 200 HTTP OK response with the request object
        return View::create($waitingUser, Response::HTTP_OK);
    }

    /**
     * Replaces WaitingUser resource
     * 
     * @Rest\Put("/waiting_user/edit/{name}")
     */
    public function putWaitingUser(string $name, Request $request): View
    {
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUser = $repository->findBy(['name' => $name]);
        $waitingUser = $waitingUser[0];
        dump($waitingUser);


        if ($waitingUser) {
            $acceptPede = $request->get('accept_walker');
            $acceptDriver = $request->get('accept_driver');
            $name = $request->get('name');
            $jsonContent =  $request->getContent();
            $parametersAsArray = [];
            if ($content = $request->getContent()) {
                $parametersAsArray = json_decode($content, true);
            }



            if (isset($parametersAsArray["accept_walker"])) {
                $waitingUser->setAcceptWalker(boolval($parametersAsArray["accept_walker"]));
            }


            if (isset($parametersAsArray["accept_driver"])) {
                $waitingUser->setAcceptDriver(boolval($parametersAsArray["accept_driver"]));
            }

            if (is_string($name) && isset($name)) {
                $waitingUser->setName($name);
            }
            if (is_string($parametersAsArray["driver_name"]) && isset($parametersAsArray["driver_name"])) {
                $waitingUser->setDriverName($parametersAsArray["driver_name"]);
            }


            dump($waitingUser);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($waitingUser);
            $entityManager->flush();
        }
        // In case our PUT was a success we need to return a 200 HTTP OK response with the object as a result of PUT
        return View::create($waitingUser, Response::HTTP_OK);
    }

    /**
     * Removes the WaitingUser resource
     * @Rest\Delete("/waiting_user/{userId}")
     * @ParamConverter("waitingUser", options={"mapping": {"userId" : "id"}})
     */
    public function deleteWaitingUser(WaitingUser $waitingUser): View
    {
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        if ($waitingUser) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($waitingUser);
            $entityManager->flush();
        }
        // In case our DELETE was a success we need to return a 204 HTTP NO CONTENT response. The object is deleted.
        return View::create([], Response::HTTP_NO_CONTENT);
    }

    //@ParamConverter("waitingUser", options={"mapping": {"userName" : "name"}})
    /**
     * Removes the WaitingUser resource
     * @Rest\Delete("/waiting_user/name/{userName}")
     * 
     */
    public function deleteWaitingUserByName(string $userName): View
    {
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUser = $repository->findByName($userName);
        if ($waitingUser) {
            foreach ($waitingUser as $user) {
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->remove($user);
                $entityManager->flush();
            }
        }
        // In case our DELETE was a success we need to return a 204 HTTP NO CONTENT response. The object is deleted.
        return View::create([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Retrieves a collection of  WaitingUser with same destination resource
     * @Rest\Get("/waiting_users/destination/{destination}")
     */
    public function getSameWaitingUsers(string $destination, Request $request): View
    {
        //$destination= strtolower(trim($destination));
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUsers =  $repository->findBy(['destination' => $destination]);

        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of waitingUser object
        return View::create($waitingUsers, Response::HTTP_OK);
    }


    /**
     * Retrieves a collection of  WaitingUser ; The closest from  the users relative a given geopos
     * @Rest\Get("/waiting_users/destination/zawarudo")
     */
    public function getClosestWaitingUsers(Request $request): View
    {
        //$destination= strtolower(trim($destination));
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        //$waitingUsers =  $repository-   (0, 0, 500);
        //dump($waitingUsers);

        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of waitingUser object
        return View::create($waitingUsers, Response::HTTP_OK);
    }

    /**
     * Retrieves a collection of  WaitingUser within radius of pos
     * @Rest\Get("/waiting_users/getbyname/{name}")
     */
    public function getByNameWaitingUsers( string $name, Request $request): View
    {

        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUsers =  $repository->findBy(['name' => $name]);
        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of waitingUser object
        return View::create($waitingUsers, Response::HTTP_OK);
    }
    /**
     * Retrieves a collection of  WaitingUser within radius of pos
     * @Rest\Get("/waiting_users/getuserinradius/radius")
     */
    public function getInRadiusUsers( Request $request): View
    {   
        $longitude = $request->query->get('longitude');
        $latitude = $request->query->get('latitude');
        $radiusInKm = $request->query->get('radius');
        $limit = $request->query->get('limit');
        $destination = $request->query->get('destination');
        //yua sakuza
        //$destination= strtolower(trim($destination));
        $repository = $this->getDoctrine()->getRepository(WaitingUser::class);
        $waitingUsers =  $repository->findInradius($longitude, $latitude, $radiusInKm, $limit, $destination);
        // In case our GET was a success we need to return a 200 HTTP OK response with the collection of waitingUser object
        return View::create($waitingUsers, Response::HTTP_OK);
    }




}
