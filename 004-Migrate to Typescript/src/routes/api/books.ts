import express, { type Request, type Response } from 'express';
import container from '../../container';
import BooksRepository from '../../models/BooksRepository';
import Book from '../../models/book';
import upload from '../../middleware/upload';
import fs from 'fs';
import type { BookFormBody, BookUpdate } from '../../types';

const router = express.Router();

type ApiRequest<B = BookFormBody, P = { id: string }> = Request<P> & { body: B };

const parseFavorite = (favorite: string | boolean | undefined): boolean =>
    favorite === 'true' || favorite === true;

// Получить все книги
router.get('/', (_req: Request, res: Response) => {
    const repo = container.get(BooksRepository);
    res.json(repo.getBooks());
});


router.get('/:id/download', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const repo = container.get(BooksRepository);
    const book = repo.getBook(id);
    if (!book) {
        res.status(404).json('404 | Книга не найдена');
        return;
    }

    if (!book.fileBook || !fs.existsSync(book.fileBook)) {
        res.status(404).json('404 | Файл книги не найден');
        return;
    }

    res.download(book.fileBook, book.fileName || 'book.pdf', (err) => {
        if (err) {
            console.error('Ошибка при скачивании:', err);
            res.status(500).json('Ошибка сервера');
        }
    });
});

// Получить книгу по ID
router.get('/:id', (req: ApiRequest<never>, res: Response) => {
    const repo = container.get(BooksRepository);
    const book = repo.getBook(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json('404 | Книга не найдена');
    }
});

// Создать книгу (с загрузкой файла)
router.post('/', upload, (req: ApiRequest, res: Response) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const fileBook = req.file ? req.file.path : '';

    const newBook = new Book({
        title,
        description,
        authors,
        favorite: parseFavorite(favorite),
        fileCover,
        fileName,
        fileBook,
    });

    const repo = container.get(BooksRepository);
    const createdBook = repo.createBook(newBook);
    res.status(201).json(createdBook);
});

// Обновить книгу (без изменения файла)
router.put('/:id', (req: ApiRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    const repo = container.get(BooksRepository);
    const existingBook = repo.getBook(id);
    if (!existingBook) {
        res.status(404).json('404 | Книга не найдена');
        return;
    }

    const updatedData: BookUpdate = {
        title: title !== undefined ? title : existingBook.title,
        description: description !== undefined ? description : existingBook.description,
        authors: authors !== undefined ? authors : existingBook.authors,
        favorite: favorite !== undefined ? parseFavorite(favorite) : existingBook.favorite,
        fileCover: fileCover !== undefined ? fileCover : existingBook.fileCover,
        fileName: fileName !== undefined ? fileName : existingBook.fileName,
    };

    const updatedBook = repo.updateBook(id, updatedData);
    res.json(updatedBook);
});

// Удалить книгу (и файл)
router.delete('/:id', (req: ApiRequest<never>, res: Response) => {
    const { id } = req.params;
    const repo = container.get(BooksRepository);
    const book = repo.getBook(id);
    if (!book) {
        res.status(404).json('404 | Книга не найдена');
        return;
    }

    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    repo.deleteBook(id);
    res.json('ok');
});

export default router;
