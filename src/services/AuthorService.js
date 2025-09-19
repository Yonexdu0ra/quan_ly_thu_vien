const { Author } = require("../models");



class AuthorService {

    static async getAllAuthors() {
        try {
            const authors = await Author.findAll({});
            return authors;
        } catch (error) {
            return [];
        }
    }
    static async getAuthorById(id) {
        try {
            const author = await Author.findByPk(id);
            return author;
        } catch (error) {
            return null;
        }
    }
    static async createAuthor(authorData) {
        try {
            const newAuthor = await Author.create(authorData);
            return newAuthor;
        } catch (error) {
            throw error;
        }
    }
    static async updateAuthor(id, authorData) {
        try {
            const author = await Author.findByPk(id);
            if (!author) {
                return null;
            }
            await author.update(authorData);
            return author;
        } catch (error) {
            throw error;
        }
    }
    static async deleteAuthor(id) {
        try {
            const author = await Author.findByPk(id);
            if (!author) {
                return null;
            }
            await author.destroy();
            return author;
        }
        catch (error) {
            throw error;
        }
    }
    
}

module.exports = AuthorService;