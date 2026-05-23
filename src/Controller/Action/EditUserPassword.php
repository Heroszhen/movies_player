<?php

declare(strict_types=1);

namespace App\Controller\Action;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class EditUserPassword extends AbstractController
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function __invoke(User $user, Request $request): User
    {
        if (null === $user->getPlainPassword()) {
            throw new BadRequestHttpException('Password is required');
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $user->getPlainPassword()
        );
        $user->setPassword($hashedPassword);

        return $user;
    }
}
