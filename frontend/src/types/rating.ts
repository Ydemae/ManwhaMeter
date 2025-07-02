// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

export type Rating = {
    id : number;
    story : number;
    feeling : number;
    characters : number;
    art_style : number;
    comment : string;
    user : {
        id : number;
        username : string;
    };
}