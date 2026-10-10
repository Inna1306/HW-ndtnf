import { v4 as uuid } from 'uuid';
import type { BookAttrs } from '../types';

export default class Book {
    id: string;
    title: string;
    description: string;
    authors: string;
    favorite: boolean;
    fileCover: string;
    fileName: string;
    fileBook: string;

    constructor({
        title = '',
        description = '',
        authors = '',
        favorite = false,
        fileCover = '',
        fileName = '',
        fileBook = '',
        id = uuid(),
    }: BookAttrs = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}
