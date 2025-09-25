const { Op } = require("sequelize");
const { Book, Author, Category } = require("../models");

class BookRepository {
  static async findAllWithAuthorAndCategory(
    {
      search,
      sortBy = "published_year",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    opts = {}
  ) {
    const options = {};
    const where = {};
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (sortBy) {
      options.order = [[sortBy, order]];
    }

    const include = [
      { model: Author, as: "author" },
      { model: Category, as: "category" },
    ];
    return Book.findAndCountAll({
      include,
      where,
      limit,
      offset: (page - 1) * limit,
      ...options,
      ...opts,
    });
  }

  static async findAll(
    {
      search,
      sortBy = "published_year",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    opts = {}
  ) {
    const options = {};
    const where = {};
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (sortBy) {
      options.order = [[sortBy, order]];
    }
    return Book.findAndCountAll({
      where,
      ...options,
      limit,
      offset: (page - 1) * limit,
      ...opts,
    });
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
