const { Op } = require("sequelize");
const { Category, Book } = require("../models");

class CategoryRepository {
  static async findAll({
    search = "",
    sortBy,
    order,
    page = 1,
    limit = 5,
  } = {}) {
    const where = {};
    const options = {};
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }
    if (sortBy) {
      options.order = [[sortBy, order]];
    }
    // console.log(sortBy, order);

    return Category.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }
  static async findAllNoPagination(options) {
    return Category.findAndCountAll(options);
  }
  static async findById(id, options = {}) {
    return Category.findByPk(id, {
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }
  static async findByIdWithBooks(id, options = {}) {
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
