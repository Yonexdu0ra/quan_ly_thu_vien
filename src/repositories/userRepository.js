const { User } = require("../models");

class UserRepository {
  static async findAll(options = {}) {
    return User.findAll(options);
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
