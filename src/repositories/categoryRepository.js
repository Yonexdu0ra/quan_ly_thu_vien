const { Category, Book } = require("../models");

class CategoryRepository {
  static async findAll(options = {}) {
    return Category.findAll({
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Category.findByPk(id, {
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }

  static async create(data, options = {}) {
    return Category.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Category.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Category.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = CategoryRepository;
