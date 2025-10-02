const { Op } = require("sequelize");
const { Borrow, Book, User, Fine } = require("../models");

class BorrowRepository {
  static async findAll(options = {}) {
    return Borrow.findAll(options);
  }

  static async findAllWithUserAndBookAndFine({
    search,
    sortBy = "id",
    order = "ASC",
    limit = 10,
    offset = 0,
  } = {}) {
    const include = [
      { model: Book, as: "book" },
      { model: User, as: "borrower" },
      { model: User, as: "approver" },
      { model: Fine, as: "fine" },
    ];

    const where = {};
    const options = {};
    if (search) {
      include[0].where = {
        title: {
          [Op.like]: `%${search || ""}%`,
        },
      };
    }
    // console.log(include[0]);

    if (sortBy) {
      options.order = [[sortBy, order]];
    }
    const borrows = await Borrow.findAndCountAll({
      include,
      where,
      limit,
      offset,
      ...options,
    });
    return borrows;
  }
  static async findAllWithUserAndBookAndFineByUserId(
    userId,
    { search, sortBy = "id", order = "ASC", limit = 10, offset = 0 } = {}
  ) {
    // console.log(order);
    const include = [
      { model: Book, as: "book" },
      { model: User, as: "borrower" },
      { model: User, as: "approver" },
      { model: Fine, as: "fine" },
    ];

    const where = {
      borrow_id: userId,
    };
    // console.log(where);

    const options = {};
    if (search) {
      include[0].where = {
        title: {
          [Op.like]: `%${search || ""}%`,
        },
      };
    }

    if (sortBy) {
      options.order = [[sortBy, order]];
    }
    // console.log(where);

    const borrows = await Borrow.findAndCountAll({
      include,
      where,
      limit,
      offset,
      ...options,
    });
    // console.log(borrows);

    return borrows;
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
