const { Op } = require("sequelize");
const { Fine, Borrow, User, Book } = require("../models");

class FineRepository {
  static async findAllWithBorrowerAndBookAndUser(
    {
      search = "",
      sortBy = "createdAt",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    options = {}
  ) {
    const include = [
      {
        model: Borrow,
        as: "borrow",
        include: [{
          model: Book,
          as: "book",
          attributes: ['id', 'title'],
          where: search ? { title: { [Op.like]: `%${search}%` } } : undefined,
          required: true
        }, {
          model: User,
          as: "borrower",
          attributes: ['fullname'],
          required: true
        }],
        required: true
      }

    ]
    const where = {};
    const orderOptions = [];
    // if (search) {
    //   where.amount = {
    //     [Op.like]: `%${search}%`,
    //   };
    // }
    if (sortBy) {
      if (sortBy === "isPaid") {
        where.isPaid = {
          [Op.eq]: order === "ASC" ? false : true,
        }
        orderOptions.push([sortBy, order])
      } {

        orderOptions.push([sortBy, order]);
      }
    }
    // console.log(where, options);

    return Fine.findAndCountAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      include,
      distinct: true,
      ...options,
    });
  }
  static async findAllByUserIdWithBorrowerAndBookAndUser(
    userId,
    {
      search = "",
      sortBy = "createdAt",
      order = "ASC",
      page = 1,
      limit = 5,
    } = {},
    options = {}
  ) {
    console.log(userId);
    
    const include = [
      {
        model: Borrow,
        as: "borrow",
        include: [{
          model: Book,
          as: "book",
          attributes: ['id', 'title'],
          where: search ? { title: { [Op.like]: `%${search}%` } } : undefined,
          required: true
        }, {
          model: User,
          as: "borrower",
          attributes: ['fullname'],
          required: true
        }],
        required: true,
        where: { borrow_id: userId }
      }

    ]
    const where = {};
    const orderOptions = [];

    if (sortBy) {
      if (sortBy === "isPaid") {
        where.isPaid = {
          [Op.eq]: order === "ASC" ? false : true,
        }
        orderOptions.push([sortBy, order])
      } {

        orderOptions.push([sortBy, order]);
      }
    }
    // console.log(where, options);

    return Fine.findAndCountAll({
      where,
      order: orderOptions,
      limit,
      offset: (page - 1) * limit,
      include,
      distinct: true,
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return Fine.findByPk(id, {
      ...options,
    });
  }
  static async findByIdWithBorrowerAndBookAndUser(id, options = {}) {
    return Fine.findByPk(id, {
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          include: [
            {
              model: Book,
              as: "book",
              attributes: ["id", "title"],
            },
            {
              model: User,
              as: "borrower",
              attributes: ["fullname"],
            },
          ],
        },
      ],
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

  // static async delete(id, options = {}) {
  //   return Fine.destroy({
  //     where: { id },
  //     ...options,
  //   });
  // }
}

module.exports = FineRepository;
