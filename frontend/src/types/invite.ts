// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { User } from "./user";

export type Invite = {
    id : number;
    uid : string;
    used : boolean;
    creator : User;
    createdAt : string;
    exp_date : string;
}