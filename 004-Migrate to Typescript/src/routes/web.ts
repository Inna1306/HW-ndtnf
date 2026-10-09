import express, { type Request, type Response, type NextFunction } from 'express';
import storage from '../models/storage';
import Book from '../models/book';
import upload from '../middleware/upload';
import fs from 'fs';
import axios from 'axios';
import type { BookFormBody } from '../types';

const router = express.Router();
const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001';

type WebRequest = Request & { body: BookFormBody };

const isFavorite = (favorite: string | boolean | undefined): boolean =>
    favorite === 'on' || favorite === 'true' || favorite === true;

// ---------- Список книг ----------
router.get('/', (_req: Request, res: Response) => {
    res.redirect('/books');
});

router.get('/books', (_req: Request, res: Response) => {
    res.render('index', { books: storage.books });
});

// ---------- Форма создания ----------
router.get('/books/create', (_req: Request, res: Response) => {
    res.render('create');
});

// ---------- Обработка создания ----------
router.post('/books', upload, (req: WebRequest, res: Response) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const fileBook = req.file ? req.file.path : '';

    const newBook = new Book({
        title,
        description,
        authors,
        favorite: isFavorite(favorite),
        fileCover,
        fileName,
        fileBook,
    });

    storage.books.push(newBook);
    res.redirect('/books');
});

// ---------- Форма редактирования ----------
router.get('/books/:id/edit', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const book = storage.books.find((b) => b.id === id);
    if (!book) {
        res.status(404).send('Книга не найдена');
        return;
    }
    res.render('update', { book });
});

// ---------- Обработка обновления ----------
router.post('/books/:id', upload, (req: WebRequest & { params: { id: string } }, res: Response) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((b) => b.id === id);
    if (idx === -1) {
        res.status(404).send('Книга не найдена');
        return;
    }

    const current = storage.books[idx] as Book;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    let fileBook = current.fileBook;
    if (req.file) {
        if (fileBook && fs.existsSync(fileBook)) {
            fs.unlinkSync(fileBook);
        }
        fileBook = req.file.path;
    }

    const updatedBook: Book = {
        ...current,
        title: title !== undefined ? title : current.title,
        description: description !== undefined ? description : current.description,
        authors: authors !== undefined ? authors : current.authors,
        favorite: favorite !== undefined ? isFavorite(favorite) : current.favorite,
        fileCover: fileCover !== undefined ? fileCover : current.fileCover,
        fileName: fileName !== undefined ? fileName : current.fileName,
        fileBook,
    };

    storage.books[idx] = updatedBook;
    res.redirect(`/books/${id}`);
});

// ---------- Удаление книги ----------
router.post('/books/:id/delete', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((b) => b.id === id);
    if (idx === -1) {
        res.status(404).send('Книга не найдена');
        return;
    }

    const book = storage.books[idx] as Book;
    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    storage.books.splice(idx, 1);
    res.redirect('/books');
});

// ---------- Просмотр одной книги (с увеличением счётчика) ----------
router.get('/books/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const book = storage.books.find((b) => b.id === id);
    if (!book) {
        res.status(404).send('Книга не найдена');
        return;
    }

    let viewCount = 0;
    try {
        await axios.post(`${COUNTER_URL}/counter/${id}/incr`);
        const response = await axios.get<{ count?: number }>(`${COUNTER_URL}/counter/${id}`);
        viewCount = response.data.count || 0;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Ошибка при обращении к счётчику:', message);
    }

    try {
        res.render('view', { book, viewCount });
    } catch (err) {
        next(err);
    }
});

export default router;
