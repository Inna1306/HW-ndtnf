import { injectable } from 'inversify';
import storage from './storage.js';

@injectable()
export class BooksRepository {
    getBooks() {
        return storage.books;
    }

    getBook(id) {
        return storage.books.find(book => book.id === id);
    }

    createBook(book) {
        storage.books.push(book);
        return book;
    }

    updateBook(id, updatedData) {
        const idx = storage.books.findIndex(book => book.id === id);
        if (idx === -1) return null;
        storage.books[idx] = { ...storage.books[idx], ...updatedData };
        return storage.books[idx];
    }

    deleteBook(id) {
        const idx = storage.books.findIndex(book => book.id === id);
        if (idx === -1) return false;
        storage.books.splice(idx, 1);
        return true;
    }
}

export default BooksRepository;