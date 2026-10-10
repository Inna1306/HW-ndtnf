import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';

describe('BooksController (e2e)', () => {
    let app: INestApplication;

    const mockBook = {
        _id: 'some-id',
        title: 'Test Book',
        author: 'Test Author',
        year: 2024,
        genre: 'Test Genre',
    };

    const mockBooksService = {
        create: jest.fn().mockResolvedValue(mockBook),
        findAll: jest.fn().mockResolvedValue([mockBook]),
        findOne: jest.fn().mockResolvedValue(mockBook),
        update: jest.fn().mockResolvedValue(mockBook),
        remove: jest.fn().mockResolvedValue(mockBook),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                {
                    provide: BooksService,
                    useValue: mockBooksService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('/books (POST) — создание книги', () => {
        return request(app.getHttpServer())
            .post('/books')
            .send({ title: 'New Book', author: 'New Author' })
            .expect(201)
            .expect(mockBook);
    });

    it('/books (GET) — получение всех книг', () => {
        return request(app.getHttpServer())
            .get('/books')
            .expect(200)
            .expect([mockBook]);
    });

    it('/books/:id (GET) — получение книги по ID', () => {
        return request(app.getHttpServer())
            .get('/books/some-id')
            .expect(200)
            .expect(mockBook);
    });

    it('/books/:id (PUT) — обновление книги', () => {
        return request(app.getHttpServer())
            .put('/books/some-id')
            .send({ title: 'Updated' })
            .expect(200)
            .expect(mockBook);
    });

    it('/books/:id (DELETE) — удаление книги', () => {
        return request(app.getHttpServer())
            .delete('/books/some-id')
            .expect(200)
            .expect(mockBook);
    });
});