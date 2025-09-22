const { Author, Book } = require("../models");

class AuthorRepository {
  static async findAll(options = {}) {
    return Author.findAll({
      include: [{ model: Book, as: "books" }],
      ...options
    });
  }

  static async findById(id) {
    return Author.findByPk(id, {
      include: [{ model: Book, as: "books" }]
    });
  }

  static async create(data) {
    return Author.create(data);
  }

  static async update(id, data) {
    return Author.update(data, { where: { id } });
  }

  static async delete(id) {
    return Author.destroy({ where: { id } });
  }
}

module.exports = AuthorRepository;
