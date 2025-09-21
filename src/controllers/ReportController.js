const { Book, Author, Category, Borrow, Account, Fine } = require("../models");

class ReportController {
  static async index(req, res) {
    try {
      const totalBooks = await Book.count();
      const totalAuthors = await Author.count();
      const totalCategories = await Category.count();
      const totalBorrows = await Borrow.count();
      const totalAccounts = await Account.count();
      const totalFines = await Fine.count();

      res.render("report/index", {
        title: "Báo cáo tổng quan",
        totalBooks,
        totalAuthors,
        totalCategories,
        totalBorrows,
        totalAccounts,
        totalFines
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }
}

module.exports = ReportController;
