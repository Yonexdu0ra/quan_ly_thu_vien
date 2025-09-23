const { Book, Author, Category } = require("../models");

class BookRepository {
  static async findAllWithAuthorAndCategor(options = {}) {
    return Book.findAll({
      include: [
        { model: Author, as: "author" },
        { model: Category, as: "category" }
      ],
      ...options
    });
  }
  static async fidnAll(options = {}) {
    return Book.findAll(options);
  }
  static async findAll(options = {}) {
    return Book.findAll(options);
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

  static async create(data, options = {}) {
    return Book.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Book.update(data, { where: { id } }, options);
  }

  static async delete(id, options = {}) {
    return Book.destroy({ where: { id },  }, options);
  }
}

module.exports = BookRepository;
