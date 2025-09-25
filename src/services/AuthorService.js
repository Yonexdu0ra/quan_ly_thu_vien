const { Author } = require("../models");
const AuthorRepository = require("../repositories/authorRepository");

class AuthorService {
  static async getAllAuthors({ search = "", sort = "", page = 1, limit = 5 } = {}) {
    try {
      
      const order = sort === "DESC" ? "DESC" : "ASC";
      const sortBy = "createdAt";
      const authors = await AuthorRepository.findAll({
        search,
        sortBy,
        order,
        page,
        limit,
      });

      return authors;
    } catch (error) {
      console.log(error.message);

      return { count: 0, rows: [] };
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
  static async getAuthorWithBooksById(id) {
    try {
      const author = await AuthorRepository.findByIdWithBooks(id);
      if (!author) {
        throw new Error("Tác giả không tồn tại");
      }
      return author;
    } catch (error) {
      throw error;
    }
  }
  static async createAuthor(authorData) {
    try {
      const newAuthor = await AuthorRepository.create(
        {
          ...authorData,
        },
        {
          fields: ["name"],
        }
      );
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
        name: authorData.name,
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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthorService;
