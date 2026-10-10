import { injectable } from 'inversify';
import storage from './storage';
import type Book from './book';
import type { BookUpdate } from '../types';

@injectable()
export class BooksRepository {
    getBooks(): Book[] {
        return storage.books;
    }

    getBook(id: string): Book | undefined {
        return storage.books.find((book) => book.id === id);
    }

    createBook(book: Book): Book {
        storage.books.push(book);
        return book;
    }

    updateBook(id: string, updatedData: BookUpdate): Book | null {
        const idx = storage.books.findIndex((book) => book.id === id);
        if (idx === -1) return null;
        const current = storage.books[idx] as Book;
        const updated: Book = { ...current, ...updatedData };
        storage.books[idx] = updated;
        return updated;
    }

    deleteBook(id: string): boolean {
        const idx = storage.books.findIndex((book) => book.id === id);
        if (idx === -1) return false;
        storage.books.splice(idx, 1);
        return true;
    }
}

export default BooksRepository;
