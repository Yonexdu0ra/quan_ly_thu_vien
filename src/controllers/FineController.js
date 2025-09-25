const { Fine, Borrow, Book, User } = require("../models");
const FineService = require("../services/FineService");

class FineController {
  // Hiển thị danh sách fines
  static async index(req, res) {
    const role = req.user.role;
    const userId = req.user.user_id;
    const { search, sort, page, limit } = req.query;
    try {


      let data
      if (role === "Reader") {
        data = await FineService.getAllByIdFinesWithBorrowerAndBookAndUser(userId, { search, sort, page, limit });
      } else {
        data = await FineService.getAllFinesWithBorrowerAndBookAndUser({ search, sort, page, limit });
      }
      const { count, rows: fines } = data
      const totalPages = Math.ceil(count / limit) || 1;
      const currentPage = parseInt(page) || 1;
      // console.log(fines);

      return res.render("fine/index", { fines, title: "Quản lý fines", totalPages, page: currentPage, query: req.query });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Lỗi server");
    }
  }

  // Form thêm fine
  static async add(req, res) {
    try {
      const borrows = await Borrow.findAll();
      res.render("fine/add", { borrows, title: "Thêm fine" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }

  // Xử lý thêm fine
  static async addPost(req, res) {
    try {
      const { amount, isPaid, borrow_id } = req.body;
      await FineService.createFine({
        amount,
        isPaid: isPaid ? true : false,
        borrow_id,
      });
      return res.redirect("/fines");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Lỗi server");
    }
  }

  // Form edit fine
  static async edit(req, res) {
    try {
      const fine = await Fine.findByPk(req.params.id);
      const borrows = await Borrow.findAll();
      if (!fine) return res.status(404).send("Không tìm thấy fine");
      res.render("fine/edit", { fine, borrows, title: "Chỉnh sửa fine" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }

  // Xử lý update fine
  static async editPost(req, res) {
    try {
      const fineId = req.params.id;
      const { amount, isPaid, borrow_id } = req.body;
      await FineService.updateFine(fineId, {
        amount,
        isPaid: isPaid ? true : false,
        borrow_id,
      });
      return res.redirect("/fines");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Lỗi server");
    }
  }

  // Xem chi tiết fine
  static async detail(req, res) {
    try {
      const fineId = req.params.id;
      const fine = await FineService.getFineByIdFineWithBorrowerAndBookAndUser(fineId);
      return res.render("fine/detail", { fine, title: "Chi tiết fine" });
    } catch (error) {
      console.error(error);
      return res.redirect('/not-found');
    }
  }
}

module.exports = FineController;
