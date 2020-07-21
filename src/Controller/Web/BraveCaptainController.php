<?php

namespace App\Controller\Web;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class BraveCaptainController extends AbstractController
{
    /**
     * @Route("/hello", name="brave_captain")
     */
    public function index()
    {
        dd("hello");
        return $this->render('brave_captain/index.html.twig', [
            'controller_name' => 'BraveCaptainController',
        ]);
    }
}
