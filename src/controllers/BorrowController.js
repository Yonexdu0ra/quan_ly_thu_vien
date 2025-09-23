const { Borrow, Book, User, Fine } = require("../models");
const BorrowService = require("../services/BorrowService");
const BookService = require("../services/BookService");
const UserService = require("../services/UserService");
class BorrowController {
  // Hiển thị danh sách phiếu mượn
  static async indexReader(req, res) {
    const user_id = req.user.user_id;
    const borrows = await BorrowService.getAllBorrowsWithUserAndBookAndFine();
    res.render("borrow/reader/index", { title: "Quản lý phiếu mượn", borrows });
  }

  // Hiển thị form thêm phiếu mượn
  static async addReader(req, res) {
    const book_id = req.query.book_id;
    // console.log(book_id);

    const books = await BookService.getAllBooks();
    const users = await UserService.getAllUsers();
    res.render("borrow/reader/add", {
      title: "Thêm phiếu mượn",
      books,
      users,
      book_id,
      oldData: {},
      error: ""
    });
  }

  // Hiển thị form chỉnh sửa phiếu mượn
  static async editReader(req, res) {
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

    const books = await Book.findAll();
    const users = await User.findAll();

    res.render("borrow/reader/edit", {
      title: "Chỉnh sửa phiếu mượn",
      borrow,
      books,
      users,
    });
  }

  // Hiển thị form xóa phiếu mượn
  static async deleteReader(req, res) {
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
      ],
    });
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

    res.render("borrow/reader/delete", { title: "Xóa phiếu mượn", borrow });
  }

  // Hiển thị chi tiết phiếu mượn
  static async detailReader(req, res) {
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
      ],
    });
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

    res.render("borrow/reader/detail", {
      title: "Chi tiết phiếu mượn",
      borrow,
    });
  }

  // Xử lý POST thêm phiếu mượn
  static async addReaderPost(req, res) {
    try {
      const borrow_id = req.user.user_id;
      const { book_id, borrow_date, due_date } = req.body;

      await BorrowService.requestBorrow({
        book_id,
        borrow_date,
        due_date,
        borrow_id,
      });

      return res.redirect("/borrows/reader");
    } catch (error) {
      // console.log(error.message);
      const book = await BookService.getAllBooks();
      const users = await UserService.getAllUsers();
      return res.render("borrow/reader/add", {
        title: "Thêm phiếu mượn",
        error: error.message,
        books: book,
        users,
        oldData: req.body,
        book_id: req.body.book_id,
      })
    }
  }

  // Xử lý POST hủy phiếu mượn
  static async deleteReaderPost(req, res) {
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    if (borrow.status !== "Đang yêu cầu mượn") {
      return res
        .status(400)
        .send("Chỉ có thể hủy phiếu mượn đang yêu cầu mượn");
    }
    await borrow.update({ status: "Đã hủy" });

    res.redirect("/borrows/reader");
  }
  static async indexLibrarian(req, res) {
    const borrows = await Borrow.findAll({
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
      ],
    });
    res.render("borrow/librarian/index", {
      title: "Quản lý phiếu mượn",
      borrows,
    });
  }

  static async detailLibrarian(req, res) {
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
        { model: Fine, as: "fine" },
      ],
    });
    // console.log(borrow);

    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

    res.render("borrow/librarian/detail", {
      title: "Chi tiết phiếu mượn",
      borrow,
    });
  }

  static async updateLibrarian(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    // const { status, return_date, pickup_date } = req.body;
    const borrow = await Borrow.findByPk(borrowId, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
      ],
    });
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    // await borrow.update({ status, return_date, pickup_date, approver_id });
    return res.render("borrow/librarian/update", {
      title: "Cập nhật phiếu mượn",
      borrow,
    });
  }
  static async markAsPickedUp(req, res) {
    const borrowId = req.params.id;
    const borrow = await BorrowService.getBorrowById(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    await BorrowService.markAsPickedUp(borrow.id);
    res.redirect("/borrows/librarian");
  }
  static async markAsReturned(req, res) {
    const borrowId = req.params.id;
    const borrow = await BorrowService.getBorrowById(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    await BorrowService.markAsReturned(borrow.id);
    res.redirect("/borrows/librarian");
  }

  static async markAsAcceptedPost(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    // const { status, return_date, pickup_date } = req.body;
    const borrow = await Borrow.findByPk(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    await BorrowService.markAsApproved(borrow.id, {
      status: "Đã duyệt, chờ lấy",
      approver_id,
    });
    // await borrow.update({ status: "Đã duyệt, chờ lấy", approver_id });
    // await borrow.book.update({ quantity_available: borrow.book.quantity_available - 1 });
    res.redirect("/borrows/librarian");
  }
  static async markAsRejectedPost(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    const borrow = await Borrow.findByPk(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    await BorrowService.markAsRejected(borrow.id, approver_id);
    res.redirect("/borrows/librarian");
  }
  static async markAsExpiredPost(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    // const { status, return_date, pickup_date } = req.body;
    const borrow = await Borrow.findByPk(borrowId, {
      include: {
        model: Fine,
        as: "fine",
      },
    });
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    if (!borrow.fine) {
      await Fine.create({ amount: 50000, isPaid: false, borrow_id: borrow.id });
    }
    await borrow.update({ status: "Quá hạn", approver_id });
    res.redirect("/borrows/librarian");
  }

  static async markAsCancelled(req, res) {
    try {
      const { borrow_id } = req.body;
      const borrow = await BorrowService.getBorrowById(borrow_id);
      if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
      await BorrowService.markAsCancelled(borrow.id);
      res.redirect("/borrows/reader");
    } catch (error) {
      res.status(500).send("Lỗi hệ thống");
    }
  }
  static async updateLibrarianPost(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    const { status, return_date = null, pickup_date = null } = req.body;
    const borrow = await Borrow.findByPk(borrowId, {
      include: [
        { model: Book, as: "book" },
        { model: User, as: "borrower" },
        { model: User, as: "approver" },
      ],
    });
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    if (status === "Đã trả" && borrow.status !== "Đã trả") {
      await borrow.book.update({
        quantity_available: borrow.book.quantity_available + 1,
      });
    }
    await borrow.update({
      status,
      return_date,
      pickup_date,
      approver_id: borrow.approver_id ? borrow.approver_id : approver_id,
    });
    return res.redirect("/borrows/librarian");
  }
}

module.exports = BorrowController;
