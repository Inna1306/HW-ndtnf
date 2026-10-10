import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: Model<BookDocument>,
    ) { }

    // POST — создание книги
    async create(createBookDto: Partial<Book>): Promise<Book> {
        const createdBook = new this.bookModel(createBookDto);
        return createdBook.save();
    }

    // GET — получение всех книг
    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    // GET — получение книги по ID
    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new NotFoundException(`Книга с ID "${id}" не найдена`);
        }
        return book;
    }

    // PUT — обновление книги по ID
    async update(id: string, updateBookDto: Partial<Book>): Promise<Book> {
        const updatedBook = await this.bookModel
            .findByIdAndUpdate(id, updateBookDto, { new: true })
            .exec();
        if (!updatedBook) {
            throw new NotFoundException(`Книга с ID "${id}" не найдена`);
        }
        return updatedBook;
    }

    // DELETE — удаление книги по ID
    async remove(id: string): Promise<Book> {
        const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
        if (!deletedBook) {
            throw new NotFoundException(`Книга с ID "${id}" не найдена`);
        }
        return deletedBook;
    }
}