// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { User } from "./user";

export type ReadingListEntity = {
    id : number;
    book : any;
    user : User;
}