const { Borrow, Book, User, Fine } = require("../models");

class BorrowRepository {
  static async findAll(options = {}) {
    return Borrow.findAll(options);
  }

  static async findAllWithUserAndBookAndFine(options = {}) {
    return Borrow.findAll({
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
        { model: Fine, as: "fine" },
      ],
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Borrow.findByPk(id, options);
  }

  static async findByIdWithUserAndBookAndFine(id, options = {}) {
    return Borrow.findByPk(id, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
        { model: Fine, as: "fine" },
      ],
      ...options,
    });
  }

  static async create(data, options = {}) {
    return Borrow.create(data, options);
  }

  static async update(id, data, options = {}) {
    return Borrow.update(data, {
      where: { id },
      ...options,
    });
  }

  static async delete(id, options = {}) {
    return Borrow.destroy({
      where: { id },
      ...options,
    });
  }
}

module.exports = BorrowRepository;
