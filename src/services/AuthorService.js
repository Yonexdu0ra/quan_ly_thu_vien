const { Author } = require("../models");
const AuthorRepository = require("../repositories/authorRepository");



class AuthorService {

    static async getAllAuthors() {
        try {
            const authors = await AuthorRepository.findAll();
            return authors;
        } catch (error) {
            return [];
        }
    }
    static async getAuthorById(id) {
        try {
            const author = await AuthorRepository.findById(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại");
            }
            return author;
        } catch (error) {
            return null;
        }
    }
    static async createAuthor(authorData) {
        try {
            const newAuthor = await AuthorRepository.create({
                ...authorData
            }, {
                fields: ['name']
            });
            return newAuthor;
        } catch (error) {
            throw error;
        }
    }
    static async updateAuthor(id, authorData) {
        try {
            const author = await AuthorRepository.findById(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại");
            }
            const updatedAuthor = await AuthorRepository.update(id, {
                name: authorData.name
            });
            return updatedAuthor;
        } catch (error) {
            throw error;
        }
    }
    static async deleteAuthor(id) {
        try {
            const author = await AuthorRepository.findById(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại");
            }
            await AuthorRepository.delete(id);
            return author;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = AuthorService;