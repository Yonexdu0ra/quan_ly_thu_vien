const { Op } = require("sequelize");
const { User } = require("../models");

class UserRepository {
  static async findAll({ search = "", sortBy = "createdAt", order = "ASC", page = 1, limit = 5 }, options = {}) {
    const where = {};
    const orderOptions = [];
    if (search) {
      where.fullname = {
        [Op.like]: `%${search}%`,
      };
    }
    if (sortBy) {
      orderOptions.push([sortBy, order]);
    }

    return User.findAndCountAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return User.findByPk(id, options);
  }

  static async findByEmail(email, options = {}) {
    return User.findOne({ where: { email }, ...options });
  }

  static async create(data, options = {}) {
    return User.create(data, options);
  }

  static async update(id, data, options = {}) {
    return User.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return User.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = UserRepository;
