const { Book, Author, Category } = require("../models")




class BookService {
    static async getAllBooks() {
        try {
            const books = await Book.findAll({})
            return books
        } catch (error) {
            return []
        }
    }
    static async getBookById(id) {
        try {
            const book = await Book.findByPk(id)
            return book
        } catch (error) {
            return null
        }
    }
    async getBookByIdWithAuthorAndCategory(id) {
        try {
            const book = await Book.findByPk(id, {
                include: [
                    { model: Author, as: "author" },
                    { model: Category, as: "category" }
                ]
            })
            return book
        } catch (error) {
            return null
        }
    }
    static async createBook(bookData) {
        try {
            const newBook = await Book.create(bookData)
            return newBook
        } catch (error) {
            throw error
        }
    }
    static async updateBook(id, bookData) {
        try {
            const book = await Book.findByPk(id)
            if (!book) {
                return null
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
            const book = await Book.findByPk(id)
            if (!book) {
                return null
            }
            await book.destroy()
            return book
        } catch (error) {
            throw error
        }
    }
}

module.exports = BookService