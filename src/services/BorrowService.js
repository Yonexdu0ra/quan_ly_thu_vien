const { Borrow, sequelize } = require("../models");
const BookRepository = require("../repositories/BookRepository");
const BorrowRepository = require("../repositories/BorrowRepository");
const {  BORROW_STATUS_CONSTANTS } = require("../utils/constants");

class BorrowService {
  static async getAllBorrowsWithUserAndBookAndFine({
    search,
    sort,
    page,
    limit,
  }) {
    try {
      // validate sort
      const sortBy = sort === "ASC" || sort === "DESC" ? "borrow_date" : sort;
      const order = sort === "DESC" ? "DESC" : "ASC";
      const borrows = await BorrowRepository.findAllWithUserAndBookAndFine({
        search,
        sortBy,
        order,
        page: page || 1,
        limit: limit || 10,
      });
      return borrows;
    } catch (error) {
      return {
        count: 0,
        rows: [],
      };
    }
  }
  static async getAllBorrowsWithUserAndBookAndFineByUserId(
    userId,
    { search, sort, page, limit }
  ) {
    try {
      const sortBy = sort === "ASC" || sort === "DESC" ? "borrow_date" : sort;
      const order = sort === "DESC" ? "DESC" : "ASC";
      const borrows =
        await BorrowRepository.findAllWithUserAndBookAndFineByUserId(userId, {
          search,
          sortBy,
          order,
          page: page || 1,
          limit: limit || 10,
        });
      return borrows;
    } catch (error) {
      // console.log(error.message);

      return {
        count: 0,
        rows: [],
      };
    }
  }
  static async getBorrowByIdWithUserAndBookAndFine(id) {
    try {
      const borrow = await BorrowRepository.findByIdWithUserAndBookAndFine(id);
      return borrow;
    } catch (error) {
      return null;
    }
  }
  static async getBorrowById(id) {
    try {
      const borrow = await BorrowRepository.findById(id);
      return borrow;
    } catch (error) {
      return null;
    }
  }
  static async createBorrow(borrowData) {
    try {
      if (!borrowData.book_id) throw new Error("Vui lòng chọn sách muốn mượn");
      if (!borrowData.user_id) throw new Error("Vui lòng chọn người mượn");
      const book = await BookRepository.getBookById(borrowData.book_id);
      if (!book) throw new Error("Sách không tồn tại");
      if (book.quantity_available < 1)
        throw new Error("Sách đã hết, vui lòng chọn sách khác");
      const newBorrow = await BorrowRepository.create(borrowData);
      return newBorrow;
    } catch (error) {
      throw error;
    }
  }
  static async updateBorrow(id, borrowData) {
    try {
      if (!borrowData.book_id) throw new Error("Vui lòng chọn sách muốn mượn");
      if (!borrowData.user_id) throw new Error("Vui lòng chọn người mượn");
      const book = await BookRepository.getBookById(borrowData.book_id);
      if (!book) throw new Error("Sách không tồn tại");
      if (book.quantity_available < 1)
        throw new Error("Sách đã hết, vui lòng chọn sách khác");
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      await borrow.update(borrowData);
      return borrow;
    } catch (error) {
      throw error;
    }
  }
  static async deleteBorrow(id) {
    try {
      const borrow = await Borrow.findByPk(id);
      if (!borrow) {
        return null;
      }
      await borrow.destroy();
      return borrow;
    } catch (error) {
      throw error;
    }
  }
  static async markAsReturned(id) {
    const transaction = await sequelize.transaction();
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      if (
        borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED &&
        borrow.status !== BORROW_STATUS_CONSTANTS.EXPIRED
      ) {
        throw new Error(
          "Chỉ có thể trả sách đang mượn hoặc quá hạn và đã nộp phí phạt (nếu có)"
        );
      }
      borrow.status = BORROW_STATUS_CONSTANTS.RETURNED;
      borrow.return_date = new Date();
      const book = await BookRepository.findById(borrow.book_id);
      if (!book) {
        throw new Error("Sách không tồn tại");
      }
      book.quantity_available += 1;
      await book.save({ transaction });
      await borrow.save({ transaction });
      await transaction.commit();
      return {
        borrow,
        book,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async markAsCancelled(id) {
    const transaction = await sequelize.transaction();
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      if (
        borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED &&
        borrow.status !== BORROW_STATUS_CONSTANTS.APPROVED
      ) {
        throw new Error(
          "Chỉ có thể hủy yêu cầu mượn đang chờ duyệt hoặc chờ lấy"
        );
      }

      const book = await BookRepository.findById(borrow.book_id);
      if (!book) {
        throw new Error("Sách không tồn tại");
      }

      await BookRepository.update(
        book.id,
        { quantity_available: book.quantity_available + 1 },
        { transaction }
      );
      await BorrowRepository.update(
        borrow.id,
        { status: BORROW_STATUS_CONSTANTS.CANCELLED },
        { transaction }
      );
      await transaction.commit();
      return {
        borrow,
        book,
      };
    } catch (error) {
      console.log(error.message);

      await transaction.rollback();
      throw error;
    }
  }
  static async markAsApproved(id, updateData = {}) {
    const transaction = await sequelize.transaction();
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      
      if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED) {
        throw new Error("Chỉ có thể duyệt yêu cầu mượn đang chờ duyệt");
      }
      await BorrowRepository.update(
        borrow.id,
        { ...updateData, status: BORROW_STATUS_CONSTANTS.APPROVED },
        { transaction }
      );

      await transaction.commit();
      return borrow;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async markAsRejected(id, approver_id) {
    const transaction = await sequelize.transaction();
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED) {
        throw new Error("Chỉ có thể từ chối yêu cầu mượn đang chờ duyệt");
      }

      const book = await BookRepository.findById(borrow.book_id);
      if (!book) {
        throw new Error("Sách không tồn tại");
      }

      await BookRepository.update(
        book.id,
        { quantity_available: book.quantity_available + 1 },
        { transaction }
      );
      await BorrowRepository.update(
        borrow.id,
        { status: BORROW_STATUS_CONSTANTS.REJECTED, approver_id },
        { transaction }
      );
      await transaction.commit();
      return {
        borrow,
        book,
      };
    } catch (error) {
      console.log(error.message);

      await transaction.rollback();
      throw error;
    }
  }
  static async markAsPickedUp(id) {
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      if (borrow.status !== BORROW_STATUS_CONSTANTS.APPROVED) {
        throw new Error("Chỉ có thể xác nhận lấy sách đã được duyệt");
      }
      borrow.status = BORROW_STATUS_CONSTANTS.BORROWED;
      borrow.pickup_date = new Date();
      await BorrowRepository.update(id, {
        status: BORROW_STATUS_CONSTANTS.BORROWED,
        pickup_date: new Date(),
      });
      return borrow;
    } catch (error) {
      throw error;
    }
  }
  static async markAsExpired(id) {
    try {
      const borrow = await BorrowRepository.findById(id);
      if (!borrow) {
        return null;
      }
      if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED) {
        throw new Error("Chỉ có thể đánh dấu quá hạn cho các mượn đang mượn");
      }
      await BorrowRepository.update(id, { status: BORROW_STATUS_CONSTANTS.EXPIRED });
      borrow.status = BORROW_STATUS_CONSTANTS.EXPIRED;
      return borrow;
    } catch (error) {
      throw error;
    }
  }
  static async requestBorrow(borrowData) {
    const transaction = await sequelize.transaction();
    try {
      const book = await BookRepository.findById(borrowData.book_id);

      if (!book) {
        throw new Error("Sách không tồn tại không thể mượn");
      }
      if (book.quantity_available < 1) {
        throw new Error("Sách đã hết, không thể yêu cầu mượn");
      }

      await BorrowRepository.create(
        {
          ...borrowData,
          book_id: book.id,
        },
        { transaction }
      );

      await BookRepository.update(
        book.id,
        { quantity_available: book.quantity_available - 1 },
        { transaction }
      );
      await transaction.commit();
      return;
    } catch (error) {
      // console.log(error.message);

      await transaction.rollback();
      throw error;
    }
  }
  static async markAsRenewDueDate(borrow_id) {
    try {
      const borrow = await BorrowRepository.findById(borrow_id);
      if (!borrow) {
        throw new Error("Phiếu mượn không tồn tại");
      }
      if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED) {
        throw new Error(
          "Chỉ có thể gia hạn thời gian mượn cho các phiếu đang mượn"
        );
      }
      // const due_date = new Date(borrow.due_date);
      // gia han thêm 3 ngày
      // console.log(borrow);

      const renew_time = new Date(borrow.due_date);
      renew_time.setDate(renew_time.getDate() + 3);
      // console.log(renew_time);

      await BorrowRepository.update(borrow.id, {
        due_date: renew_time,
      });

      borrow.due_date = renew_time;
      return borrow;
    } catch (error) {
      // console.log(error.message);

      throw error;
    }
  }
}

module.exports = BorrowService;
