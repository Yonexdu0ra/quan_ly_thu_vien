const { Account, User } = require("../models");

class AccountRepository {
  static async findAll(options = {}) {
    return Account.findAll(options);
  }

  static async findById(id) {
    return Account.findByPk(id);
  }
  static async findByIdWithUser(id) {
    return Account.findByPk(id, { include: { model: User, as: 'user' } });
  }
  static async findByUsernameWithUser(username) {
    return Account.findOne({
      where: { username }, include: {
        model: User, as: 'user'
      }
    });
  }
  static async findByUsernamer(username) {
    return Account.findOne({
      where: { username }
    });
  }

  static async create(data) {
    return Account.create(data);
  }

  static async update(id, data) {
    return Account.update(data, { where: { id } });
  }

  static async delete(id) {
    return Account.destroy({ where: { id } });
  }
}

module.exports = AccountRepository;
