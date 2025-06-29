import { User } from "./user";

export type ReadingListEntity = {
    id : number;
    book : any;
    user : User;
}