<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

class RegistrationInput
{
    public function __construct(
        #[Assert\NotBlank(allowNull: false)]
        #[Assert\Email]
        #[Groups(['registration:i'])]
        public string $email
    ) {
    }
}
