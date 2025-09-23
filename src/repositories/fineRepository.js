const { Fine, Borrow } = require("../models");

class FineRepository {
  static async findAll(options = {}) {
    return Fine.findAll({
      include: [{ model: Borrow, as: "borrow" }],
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Fine.findByPk(id, {
      include: [{ model: Borrow, as: "borrow" }],
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
