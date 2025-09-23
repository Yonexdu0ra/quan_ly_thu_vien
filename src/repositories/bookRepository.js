const { Book, Author, Category } = require("../models");

class BookRepository {
  static async findAllWithAuthorAndCategory(options = {}) {
    return Book.findAll({
      include: [
        { model: Author, as: "author" },
        { model: Category, as: "category" },
      ],
      ...options,
    });
  }

  static async findAll(options = {}) {
    return Book.findAll(options);
  }

  static async findById(id, options = {}) {
    return Book.findByPk(id, options);
  }

  static async findByIdWithAuthorAndCategory(id, options = {}) {
    return Book.findByPk(id, {
      include: [
        { model: Author, as: "author" },
        { model: Category, as: "category" },
      ],
      ...options,
    });
  }

  static async findByISBN(isbn, options = {}) {
    return Book.findOne({ where: { isbn }, ...options });
  }

  static async create(data, options = {}) {
    return Book.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Book.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Book.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = BookRepository;
