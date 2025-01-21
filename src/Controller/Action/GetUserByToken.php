<?php

namespace App\Controller\Action;

use App\Entity\User;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetUserByToken extends AbstractController
{
    public function __construct(
        private Security $security
    ) {}

    public function __invoke(Request $request): User
    {
        return $this->security->getUser();
    }
}