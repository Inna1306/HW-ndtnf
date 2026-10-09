import type Book from './book';

export interface Storage {
    books: Book[];
}

const storage: Storage = {
    books: [],
};

export default storage;
