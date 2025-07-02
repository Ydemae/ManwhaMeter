// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

export type DetailedUser = {
    id : number | null,
    username : string;
    profilePicture : string;
    createdAt : string | null;
    updatedAt : string | null;
    password : string | null;
    active : boolean;
}