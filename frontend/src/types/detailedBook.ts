// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Rating } from "./rating";

export type DetailedBook = {
    id : number;
    name : string;
    description : string;
    tags : Array<{id: number, label: string}>;
    image_path : string;
    overall_rating : number;
    ratings : Array<Rating>;
    status : string;
    bookType : string;
}