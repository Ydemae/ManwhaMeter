import { BookStatus } from "../enum/bookStatus";
import { BookType } from "../enum/bookType";

export type Book = {
    name : string;
    description : string;
    tags_ids : number[];
    image : string;
    book_type : BookType;
    status : BookStatus;
}