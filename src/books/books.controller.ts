import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    // POST /books — создать книгу
    @Post()
    async create(@Body() createBookDto: Partial<Book>): Promise<Book> {
        return this.booksService.create(createBookDto);
    }

    // GET /books — получить все книги
    @Get()
    async findAll(): Promise<Book[]> {
        return this.booksService.findAll();
    }

    // GET /books/:id — получить одну книгу
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Book> {
        return this.booksService.findOne(id);
    }

    // PUT /books/:id — обновить книгу
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBookDto: Partial<Book>,
    ): Promise<Book> {
        return this.booksService.update(id, updateBookDto);
    }

    // DELETE /books/:id — удалить книгу
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Book> {
        return this.booksService.remove(id);
    }
}