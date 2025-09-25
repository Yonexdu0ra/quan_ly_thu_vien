const { Borrow, Book, User, Fine } = require("../models");
const BorrowService = require("../services/BorrowService");
const BookService = require("../services/BookService");
const UserService = require("../services/UserService");
const FineService = require("../services/FineService");
class BorrowController {
  // Hiển thị danh sách phiếu mượn
  static async indexReader(req, res) {
    const { search, sort, page = 1, limit = 5 } = req.query;
    // lấy ra danh sách phiếu mượn của riêng user đang đăng nhập
    const user_id = req.user.user_id;
    const { count, rows } =
      await BorrowService.getAllBorrowsWithUserAndBookAndFineByUserId(user_id, {
        search,
        sort,
        page,
        limit,
      });
    const total = count;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = parseInt(page) || 1;

    res.render(`borrow/reader/index`, {
      title: "Quản lý phiếu mượn",
      borrows: rows || [],
      totalPages,
      page: currentPage,
      query: req.query,
    });
  }

  // Hiển thị form thêm phiếu mượn
  static async addReader(req, res) {
    const book_id = req.query.book_id;
    // console.log(book_id);

    const { rows: books } = await BookService.getAllBooks();
    const { rows: users } = await UserService.getAllUsers();
    return res.render("borrow/reader/add", {
      title: "Thêm phiếu mượn",
      books,
      users,
      book_id,
      oldData: {},
      error: "",
    });
  }

  // Hiển thị form chỉnh sửa phiếu mượn
  static async editReader(req, res) {
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);

      const books = await Book.findAll();
      const users = await User.findAll();

      return res.render("borrow/reader/edit", {
        title: "Chỉnh sửa phiếu mượn",
        borrow,
        books,
        users,
      });
    } catch (error) {
      return res.redirect("/not-found");
    }
  }

  // Hiển thị form xóa phiếu mượn
  static async viewMarkAsCancelled(req, res) {
    const borrowId = req.params.id;
    const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
      borrowId
    );

    return res.render("borrow/reader/delete", {
      title: "Hủy phiếu mượn",
      borrow,
    });
  }

  // Hiển thị chi tiết phiếu mượn
  static async detailReader(req, res) {
    const borrowId = req.params.id;
    const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
      borrowId
    );

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
      const { rows: books } = await BookService.getAllBooks();
      const { rows: users } = await UserService.getAllUsers();
      return res.render("borrow/reader/add", {
        title: "Thêm phiếu mượn",
        error: error.message,
        books,
        users,
        oldData: req.body,
        book_id: req.body.book_id,
      });
    }
  }

  static async indexLibrarian(req, res) {
    const { search, sort, page = 1, limit = 5 } = req.query;
    const { count, rows } =
      await BorrowService.getAllBorrowsWithUserAndBookAndFine({
        search,
        sort,
        page,
        limit,
      });
    const total = count;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = parseInt(page) || 1;

    res.render(`borrow/librarian/index`, {
      title: "Quản lý phiếu mượn",
      borrows: rows || [],
      totalPages,
      page: currentPage,
      query: req.query,
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
      approver_id,
    });
    // await borrow.update({ status: "Đã duyệt, chờ lấy", approver_id });
    // await borrow.book.update({ quantity_available: borrow.book.quantity_available - 1 });
    res.redirect("/borrows/librarian");
  }
  static async markAsRejectedPost(req, res) {
    const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    const borrow = await BorrowService.getBorrowById(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    await BorrowService.markAsRejected(borrow.id, approver_id);
    res.redirect("/borrows/librarian");
  }
  static async markAsExpiredPost(req, res) {
    // const approver_id = req.user.user_id;
    const borrowId = req.params.id;
    // const { status, return_date, pickup_date } = req.body;
    const borrow = await BorrowService.getBorrowById(borrowId);
    if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
    if (!borrow.fine) {
      await FineService.createFine({
        amount: 5000,
        isPaid: false,
        borrow_id: borrow.id,
        user_id: borrow.approver_id,
      });
    }
    await BorrowService.markAsExpired(borrow.id);
    // await borrow.update({ status: "Quá hạn", approver_id });
    return res.redirect("/borrows/librarian");
  }

  static async markAsCancelled(req, res) {
    try {
      const { borrow_id } = req.body;
      const borrow = await BorrowService.getBorrowById(borrow_id);
      if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
      await BorrowService.markAsCancelled(borrow.id);
      return res.redirect("/borrows/reader");
    } catch (error) {
      return res.status(500).send("Lỗi hệ thống");
    }
  }
  // Gia hạn ngày trả thêm 3 ngày
  static async markAsRenewDueDate(req, res) {
    try {
      const borrow_id = req.params.id;
      await BorrowService.markAsRenewDueDate(borrow_id);
      return res.redirect("/borrows/librarian");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}

module.exports = BorrowController;
