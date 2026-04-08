<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->isActive()) {
            throw new DisabledException('Your account has been disabled.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
    }
}
