const { Op } = require("sequelize");
const { Fine, Borrow } = require("../models");

class FineRepository {
  static async findAll(
    {
      search = "",
      sortBy = "createdAt",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    options = {}
  ) {
    const where = {};
    const orderOptions = [];
    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }
    if (sortBy) {
      orderOptions.push([sortBy, order]);
    }

    return Fine.findAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }
  static async findAllByUserId(
    userId,
    {
      search = "",
      sortBy = "createdAt",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    options = {}
  ) {
    const where = {
      userId,
    };
    const orderOptions = [];
    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }
    if (sortBy) {
      orderOptions.push([sortBy, order]);
    }

    return Fine.findAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Fine.findByPk(id, {
      ...options,
    });
  }

  static async create(data, options = {}) {
    return Fine.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Fine.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Fine.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = FineRepository;
