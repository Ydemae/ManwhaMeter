<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\enum;

enum BookType : string{
    case MANGA = "manga";
    case WEBTOON = "webtoon/manwha";
    case NOVEL = "novel";
}
