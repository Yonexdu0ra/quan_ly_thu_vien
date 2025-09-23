const { Book, Author, Category, Borrow, Account, Fine } = require("../models");

class ReportController {
  static async index(req, res) {
    try {
      const books = await Book.findAndCountAll();
      const authors = await Author.findAndCountAll();
      const categories = await Category.findAndCountAll({});
      const borrows = await Borrow.findAndCountAll({
         attributes: ['status']
      });
      const accounts = await Account.findAndCountAll();
      const fines = await Fine.findAndCountAll();

      res.render("report/index", {
        title: "Báo cáo tổng quan",
        books,
        authors,
        categories,
        borrows,
        accounts,
        fines
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }
}

module.exports = ReportController;
