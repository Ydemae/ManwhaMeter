import { Rating } from "./rating";

export type DetailedBook = {
    id : number;
    name : string;
    description : string;
    tags : Array<{id: number, label: string}>;
    image_path : string;
    overall_rating : number;
    ratings : Array<Rating>;
    status : {id : number, label : string};
    bookType : {id : number, label : string};
}