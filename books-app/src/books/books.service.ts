import { Injectable } from '@nestjs/common';

export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

@Injectable()
export class BooksService {
    private books: Book[] = [
        { id: 1, title: 'Война и мир', author: 'Л. Н. Толстой', year: 1869 },
        { id: 2, title: 'Преступление и наказание', author: 'Ф. М. Достоевский', year: 1866 },
        { id: 3, title: 'Мастер и Маргарита', author: 'М. А. Булгаков', year: 1967 },
    ];

    findAll(): Book[] {
        return this.books;
    }

    findOne(id: number): Book | undefined {
        return this.books.find((book) => book.id === id);
    }

    create(book: Omit<Book, 'id'>): Book {
        const newBook: Book = { id: Date.now(), ...book };
        this.books.push(newBook);
        return newBook;
    }
}