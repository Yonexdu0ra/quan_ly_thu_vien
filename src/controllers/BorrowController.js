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

    return res.render(`borrow/reader/index`, {
      title: "Quản lý phiếu mượn",
      borrows: rows || [],
      totalPages,
      page: currentPage,
      query: req.query,
      error: null
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
      error: null,
    });
  }

  // Hiển thị form chỉnh sửa phiếu mượn
  static async editReader(req, res) {
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);

      const { rows: books } = await BookService.getAllBooks();
      const { rows: users } = await UserService.getAllUsers();

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
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
        borrowId
      );

      return res.render("borrow/reader/delete", {
        title: "Hủy phiếu mượn",
        borrow,
      });
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/reader?error=${encodeMessage}`);
    }
  }

  // Hiển thị chi tiết phiếu mượn
  static async detailReader(req, res) {

    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
        borrowId
      );

      return res.render("borrow/reader/detail", {
        title: "Chi tiết phiếu mượn",
        borrow,
      });

    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/reader?error=${encodeMessage}`);
    }
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

    return res.render(`borrow/librarian/index`, {
      title: "Quản lý phiếu mượn",
      borrows: rows || [],
      totalPages,
      page: currentPage,
      query: req.query,
    });
  }

  static async detailLibrarian(req, res) {
    const borrowId = req.params.id;

    const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
      borrowId
    );
    // console.log(borrow);

    if (!borrow) return res.redirect('/not-found');

    return res.render("borrow/librarian/detail", {
      title: "Chi tiết phiếu mượn",
      borrow,
    });
  }

  // static async updateLibrarian(req, res) {
  //   const borrowId = req.params.id;

  //   const borrow = await BorrowService.getBorrowByIdWithUserAndBookAndFine(
  //     borrowId
  //   );
  //   if (!borrow) return res.redirect('/not-found');
  //   return res.render("borrow/librarian/update", {
  //     title: "Cập nhật phiếu mượn",
  //     borrow,
  //   });
  // }
  static async markAsPickedUp(req, res) {
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsPickedUp(borrow.id);
      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }
  static async markAsReturned(req, res) {
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsReturned(borrow.id);
      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }

  static async markAsAcceptedPost(req, res) {
    try {
      const approver_id = req.user.user_id;
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsApproved(borrowId, {
        approver_id,
      });

      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }
  static async markAsRejectedPost(req, res) {
    try {
      const approver_id = req.user.user_id;
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsRejected(borrow.id, approver_id);
      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }
  static async markAsExpiredPost(req, res) {
    try {
      const borrowId = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrowId);
      if (!borrow) return res.redirect('/not-found');
      // khi đánh dấu là quá hạn thì tạo luôn bản ghi phạt nếu chưa có
      if (!borrow.fine) {
        await FineService.createFine({
          amount: 5000,
          isPaid: false,
          borrow_id: borrow.id,

        });
      }
      await BorrowService.markAsExpired(borrow.id);

      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }

  static async markAsCancelled(req, res) {
    try {
      const { borrow_id } = req.body;
      const borrow = await BorrowService.getBorrowById(borrow_id);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsCancelled(borrow.id);
      return res.redirect("/borrows/reader");
    } catch (error) {
      // về trang reader với message lỗi
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/reader?error=${encodeMessage}`);
    }
  }
  // Gia hạn ngày trả thêm 3 ngày
  static async markAsRenewDueDate(req, res) {
    try {
      const borrow_id = req.params.id;
      const borrow = await BorrowService.getBorrowById(borrow_id);
      if (!borrow) return res.redirect('/not-found');
      await BorrowService.markAsRenewDueDate(borrow_id);
      return res.redirect("/borrows/librarian");
    } catch (error) {
      const encodeMessage = btoa(error.message);
      return res.redirect(`/borrows/librarian?error=${encodeMessage}`);
    }
  }
}

module.exports = BorrowController;
