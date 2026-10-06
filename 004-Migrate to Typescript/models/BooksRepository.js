import Book from './Book.js';

class BooksRepository {
    async getBooks() {
        return Book.find().lean();
    }

    async getBook(id) {
        return Book.findOne({ id }).lean();
    }

    async createBook(bookData) {
        const book = new Book(bookData);
        return book.save();
    }

    async updateBook(id, updatedData) {
        return Book.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true, runValidators: true }
        ).lean();
    }

    async deleteBook(id) {
        const result = await Book.deleteOne({ id });
        return result.deletedCount > 0;
    }
}

export default BooksRepository;