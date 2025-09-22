const { Fine, Borrow } = require("../models");

class FineRepository {
  static async findAll(options = {}) {
    return Fine.findAll({
      include: [{ model: Borrow, as: "borrow" }],
      ...options
    });
  }

  static async findById(id) {
    return Fine.findByPk(id, {
      include: [{ model: Borrow, as: "borrow" }]
    });
  }

  static async create(data) {
    return Fine.create(data);
  }

  static async update(id, data) {
    return Fine.update(data, { where: { id } });
  }

  static async delete(id) {
    return Fine.destroy({ where: { id } });
  }
}

module.exports = FineRepository;
