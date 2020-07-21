<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\WaitingUserRepository")
 */
class WaitingUser
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     */
    private $longitude;

    /**
     * @ORM\Column(type="float")
     */
    private $latitude;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $destination;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $acceptWalker;

    /**
     * @ORM\Column(type="boolean")
     */
    private $acceptDriver;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $driverName;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(string $destination): self
    {
        $this->destination = $destination;

        return $this;
    }

    public function getAcceptWalker(): ?bool
    {
        return $this->acceptWalker;
    }

    public function setAcceptWalker( $acceptWalker): self
    {
        $this->acceptWalker = $acceptWalker;

        return $this;
    }

    public function getAcceptDriver(): ?bool
    {
        return $this->acceptDriver;
    }

    public function setAcceptDriver($acceptDriver): self
    {
        $this->acceptDriver = $acceptDriver;

        return $this;
    }

    public function getDriverName(): ?string
    {
        return $this->driverName;
    }

    public function setDriverName(string $driverName): self
    {
        $this->driverName = $driverName;

        return $this;
    }

    public function getDeletablefield(): ?string
    {
        return $this->deletablefield;
    }

    public function setDeletablefield(?string $deletablefield): self
    {
        $this->deletablefield = $deletablefield;

        return $this;
    }

    public function getDeletableboolean(): ?bool
    {
        return $this->deletableboolean;
    }

    public function setDeletableboolean(?bool $deletableboolean): self
    {
        $this->deletableboolean = $deletableboolean;

        return $this;
    }
}
