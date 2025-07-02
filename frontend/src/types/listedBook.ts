// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

export type ListedBook = {
    id : number;
    name : string;
    description : string;
    tags : string[];
    image_path : string;
    bookType : string;
    overall_rating : number;
}