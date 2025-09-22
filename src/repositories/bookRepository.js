const { Book, Author, Category } = require("../models");

class BookRepository {
  static async findAll(options = {}) {
    return Book.findAll({
      include: [
        { model: Author, as: "author" },
        { model: Category, as: "category" }
      ],
      ...options
    });
  }

  static async findById(id) {
    return Book.findByPk(id);
  }
  static async findByIdWithAuthorAndCategory(id) {
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
  static async findByISBN(isbn) {
    return Book.findOne({ where: { isbn } });
  }

  static async create(data) {
    return Book.create(data);
  }

  static async update(id, data) {
    return Book.update(data, { where: { id } });
  }

  static async delete(id) {
    return Book.destroy({ where: { id } });
  }
}

module.exports = BookRepository;
