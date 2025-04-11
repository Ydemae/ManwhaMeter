<?php
namespace App\enum;

enum BookType : string{
    case MANGA = "manga";
    case WEBTOON = "webtoon/manwha";
    case NOVEL = "novel";
}
