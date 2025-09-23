const { Author, Book } = require("../models");

class AuthorRepository {
  static async findAll(options = {}) {
    return Author.findAll({
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Author.findByPk(id, {
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }

  static async create(data, options = {}) {
    return Author.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Author.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Author.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = AuthorRepository;
