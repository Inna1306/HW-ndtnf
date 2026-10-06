import express from 'express';
import container from '../../container.js';
import BooksRepository from '../../models/BooksRepository.js';

import upload from '../../middleware/upload.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Получить все книги
router.get('/', async (req, res, next) => {
    try {
        const repo = container.get(BooksRepository);
        const books = await repo.getBooks();
        res.json(books);
    } catch (err) {
        next(err);
    }
});

// Получить книгу по ID
router.get('/:id', async (req, res, next) => {
    try {
        const repo = container.get(BooksRepository);
        const book = await repo.getBook(req.params.id);
        if (!book) {
            return res.status(404).json('404 | Книга не найдена');
        }
        res.json(book);
    } catch (err) {
        next(err);
    }
});

// Создать книгу
router.post('/', upload, async (req, res, next) => {
    try {
        const { title, description, authors, favorite, fileCover, fileName } = req.body;
        let fileBook = '';
        if (req.file) {
            fileBook = req.file.path;
        }
        const favoriteBool = favorite === 'true' || favorite === true;
        const newBook = {
            id: uuidv4(), // генерируем уникальный строковый id
            title,
            description,
            authors,
            favorite: favoriteBool ? 'true' : 'false',
            fileCover,
            fileName,
            fileBook,
        };
        const repo = container.get(BooksRepository);
        const createdBook = await repo.createBook(newBook);
        res.status(201).json(createdBook);
    } catch (err) {
        next(err);
    }
});

// Обновить книгу
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, authors, favorite, fileCover, fileName } = req.body;
        const repo = container.get(BooksRepository);
        const existingBook = await repo.getBook(id);
        if (!existingBook) {
            return res.status(404).json('404 | Книга не найдена');
        }
        const updatedData = {
            title: title !== undefined ? title : existingBook.title,
            description: description !== undefined ? description : existingBook.description,
            authors: authors !== undefined ? authors : existingBook.authors,
            favorite: favorite !== undefined
                ? (favorite === 'true' || favorite === true ? 'true' : 'false')
                : existingBook.favorite,
            fileCover: fileCover !== undefined ? fileCover : existingBook.fileCover,
            fileName: fileName !== undefined ? fileName : existingBook.fileName,
        };
        const updatedBook = await repo.updateBook(id, updatedData);
        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});

// Удалить книгу
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const repo = container.get(BooksRepository);
        const book = await repo.getBook(id);
        if (!book) {
            return res.status(404).json('404 | Книга не найдена');
        }
        if (book.fileBook && fs.existsSync(book.fileBook)) {
            fs.unlinkSync(book.fileBook);
        }
        await repo.deleteBook(id);
        res.json('ok');
    } catch (err) {
        next(err);
    }
});

// Скачать файл книги
router.get('/:id/download', async (req, res, next) => {
    try {
        const { id } = req.params;
        const repo = container.get(BooksRepository);
        const book = await repo.getBook(id);
        if (!book) {
            return res.status(404).json('404 | Книга не найдена');
        }
        if (!book.fileBook || !fs.existsSync(book.fileBook)) {
            return res.status(404).json('404 | Файл книги не найден');
        }
        res.download(book.fileBook, book.fileName || 'book.pdf', (err) => {
            if (err) {
                console.error('Ошибка при скачивании:', err);
                res.status(500).json('Ошибка сервера');
            }
        });
    } catch (err) {
        next(err);
    }
});

export default router;