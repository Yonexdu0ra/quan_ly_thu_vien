const { Category, Book } = require("../models");

class CategoryRepository {
  static async findAll(options = {}) {
    return Category.findAll({
      include: [{ model: Book, as: "books" }],
      ...options
    });
  }

  static async findById(id) {
    return Category.findByPk(id, {
      include: [{ model: Book, as: "books" }]
    });
  }

  static async create(data) {
    return Category.create(data);
  }

  static async update(id, data) {
    return Category.update(data, { where: { id } });
  }

  static async delete(id) {
    return Category.destroy({ where: { id } });
  }
}

module.exports = CategoryRepository;
