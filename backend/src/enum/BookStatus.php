<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\enum;

enum BookStatus : string{
    case ONGOING = "ongoing";
    case PAUSED = "paused";
    case COMPLETED = "completed";
    case DROPPED = "dropped";
}
