import { User } from "./user";

export type Invite = {
    id : number;
    uid : string;
    used : boolean;
    creator : User;
    createdAt : string;
    exp_date : string;
}