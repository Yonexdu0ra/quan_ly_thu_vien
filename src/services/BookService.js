
const BookRepository = require("../repositories/BookRepository")



class BookService {
    static async getAllBooksWithAuthorAndCategory() {
        try {
            const books = await BookRepository.findAllWithAuthorAndCategor({})
            return books
        } catch (error) {
            return []
        }
    }
    static getAllBooks() {
        try {
            const books = BookRepository.findAll({})
            return books
        } catch (error) {
            return []
        }
    }
    static async getBookById(id) {
        try {
            const book = await BookRepository.findById(id)
            if (!book) {
                throw new Error("Book not found")
            }
            return book
        } catch (error) {
            throw error
        }
    }
    async getBookByIdWithAuthorAndCategory(id) {
        try {
            const book = await BookRepository.findByIdWithAuthorAndCategory(id)
            if (!book) {
                throw new Error("Book not found")
            }
            return book
        } catch (error) {
            throw error
        }
    }
    static async createBook(bookData) {
        try {
            if(bookData.quantity_total < bookData.quantity_available) {
                throw new Error("Số lượng có sẵn không được lớn hơn tổng số lượng")
            }
            const newBook = await BookRepository.create(bookData)
            return newBook
        } catch (error) {
            throw error
        }
    }
    static async updateBook(id, bookData) {
        try {
            if(bookData.quantity_total < bookData.quantity_available) {
                throw new Error("Số lượng có sẵn không được lớn hơn tổng số lượng")
            }
            const book = await BookRepository.findById(id)
            if (!book) {
                throw new Error("Book not found")
            }
            await book.update(bookData)
            return book
        }
        catch (error) {
            throw error
        }
    }
    static async deleteBook(id) {
        try {
            const book = await BookRepository.findById(id)
            if (!book) {
                throw new Error("Book not found")
            }
            await BookRepository.delete(id)
            return book
        } catch (error) {
            throw error
        }
    }
}

module.exports = BookService