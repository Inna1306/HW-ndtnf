import express from 'express';
import container from '../../container.js';
import BooksRepository from '../../models/BooksRepository.js';
import Book from '../../models/book.js';
import upload from '../../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

// Получить все книги
router.get('/', (req, res) => {
    const repo = container.get(BooksRepository);
    res.json(repo.getBooks());
});

// Получить книгу по ID
router.get('/:id', (req, res) => {
    const repo = container.get(BooksRepository);
    const book = repo.getBook(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json('404 | Книга не найдена');
    }
});

// Создать книгу (с загрузкой файла)
router.post('/', upload, (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = '';
    if (req.file) {
        fileBook = req.file.path;
    }

    const favoriteBool = favorite === 'true' || favorite === true;

    const newBook = new Book({
        title,
        description,
        authors,
        favorite: favoriteBool,
        fileCover,
        fileName,
        fileBook,
    });

    const repo = container.get(BooksRepository);
    const createdBook = repo.createBook(newBook);
    res.status(201).json(createdBook);
});

// Обновить книгу (без изменения файла)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    const repo = container.get(BooksRepository);
    const existingBook = repo.getBook(id);
    if (!existingBook) {
        return res.status(404).json('404 | Книга не найдена');
    }

    const updatedData = {
        title: title !== undefined ? title : existingBook.title,
        description: description !== undefined ? description : existingBook.description,
        authors: authors !== undefined ? authors : existingBook.authors,
        favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : existingBook.favorite,
        fileCover: fileCover !== undefined ? fileCover : existingBook.fileCover,
        fileName: fileName !== undefined ? fileName : existingBook.fileName,
    };

    const updatedBook = repo.updateBook(id, updatedData);
    res.json(updatedBook);
});

// Удалить книгу (и файл)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const repo = container.get(BooksRepository);
    const book = repo.getBook(id);
    if (!book) {
        return res.status(404).json('404 | Книга не найдена');
    }

    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    repo.deleteBook(id);
    res.json('ok');
});

// Скачать файл книги
router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const repo = container.get(BooksRepository);
    const book = repo.getBook(id);
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
});

export default router;