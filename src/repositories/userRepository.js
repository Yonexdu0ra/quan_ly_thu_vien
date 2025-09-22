const { User } = require("../models");

class UserRepository {
  static async findAll(options = {}) {
    return User.findAll(options);
  }

  static async findById(id) {
    return User.findByPk(id);
  }

  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static async create(data) {
    return User.create(data);
  }

  static async update(id, data) {
    return User.update(data, { where: { id } });
  }

  static async delete(id) {
    return User.destroy({ where: { id } });
  }
}

module.exports = UserRepository;
