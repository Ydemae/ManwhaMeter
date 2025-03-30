<?php
enum BookStatus : string{
    case ONGOING = "ongoing";
    case PAUSED = "paused";
    case COMPLETED = "completed";
    case DROPPED = "dropped";
}