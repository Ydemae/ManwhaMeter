<?php
namespace App\enum;

enum BookStatus : string{
    case ONGOING = "ongoing";
    case PAUSED = "paused";
    case COMPLETED = "completed";
    case DROPPED = "dropped";
}
