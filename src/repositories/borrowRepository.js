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
        { model: Fine, as: "fine" }
      ],
      ...options
    });
  }
  static async findById(id) {
    return Borrow.findByPk(id);
  }
  static async findByIdWithUserAndBookAndFine(id) {
    return Borrow.findByPk(id, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
        { model: Fine, as: "fine" }
      ]
    });
  }

  static async create(data) {
    return Borrow.create(data);
  }

  static async update(id, data) {
    return Borrow.update(data, { where: { id } });
  }

  static async delete(id) {
    return Borrow.destroy({ where: { id } });
  }
}

module.exports = BorrowRepository;
