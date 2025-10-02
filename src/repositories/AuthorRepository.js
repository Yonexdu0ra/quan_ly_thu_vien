const { Op } = require("sequelize");
const { Author, Book } = require("../models");

class AuthorRepository {
  static async findAll({
    search = "",
    sortBy = "createdAt",
    order = "ASC",
    page = 1,
    limit = 5,
  } = {}) {
    const where = {};
    const options = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (sortBy) {
      options.order = [[sortBy, order]];
    }

    return Author.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }

  static async findByIdWithBooks(id, options = {}) {
    return Author.findByPk(id, {
      include: [{ model: Book, as: "books" }],
      ...options,
    });
  }
  static async findById(id, options = {}) {
    return Author.findByPk(id, options);
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
