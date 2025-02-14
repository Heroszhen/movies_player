<?php

namespace App\Command;

use App\Entity\Movie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:update',
    description: 'Add a short description for your command',
)]
class UpdateCommand extends Command
{
    const BATCH_SIZE = 50;

    public function __construct(
        private EntityManagerInterface $entityManager
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $n = 0;
        $movies = $this->entityManager->getRepository(Movie::class)->findAll();
        foreach ($movies as $movie) {
            /** @var Movie $movie */
            $movie->setNotified(true);
            $n++;

            if (($n % self::BATCH_SIZE) === 0) {
                $this->entityManager->flush();
                $this->entityManager->clear();
            }
        }

        $io->success('Success');

        return Command::SUCCESS;
    }
}
