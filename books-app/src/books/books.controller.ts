import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    findOne(@Param('id') id: string): Book | undefined {
        return this.booksService.findOne(Number(id));
    }

    @Post()
    create(@Body() book: Omit<Book, 'id'>): Book {
        return this.booksService.create(book);
    }
}