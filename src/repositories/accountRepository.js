const { Op } = require("sequelize");
const { Account, User } = require("../models");

class AccountRepository {
  static async findAll({ search = "", sortBy = "createdAt", order = "ASC", page = 1, limit = 5 } = {}, options = {}) {

    const where = {};
    const orderOptions = [];
    if (search) {
      where.username = {
        [Op.like]: `%${search}%`,
      };
    }
    if (sortBy) {
      orderOptions.push([sortBy, order]);
    }

    return Account.findAndCountAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Account.findByPk(id, options);
  }

  static async findByIdWithUser(id, options = {}) {
    return Account.findByPk(id, {
      include: { model: User, as: "user" },
      ...options,
    });
  }

  

  static async create(data, options = {}) {
    return Account.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Account.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Account.destroy({
      where: { id },
      ...options,
    });
  }
  static async findByUsername(username, options = {}) {
    return Account.findOne({
      where: { username },
      ...options,
    });
  }
  static async findByUsernameWithUser(username, options = {}) {
    return Account.findOne({
      where: { username },
      include: { model: User, as: "user" },
      ...options,
    });
  }
}

module.exports = AccountRepository;
