import { Body, Controller, Get, Param, Post, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import type { Book } from './books.service';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    findAll(): Book[] {
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Book {
        const book = this.booksService.findOne(id);
        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }

    @Post()
    create(@Body() book: Omit<Book, 'id'>): Book {
        return this.booksService.create(book);
    }
}