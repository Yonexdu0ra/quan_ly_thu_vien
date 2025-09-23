const { Borrow, sequelize, Book } = require("../models");
const BookRepository = require("../repositories/BookRepository");
const BorrowRepository = require("../repositories/BorrowRepository");

class BorrowService {
  static async getAllBorrowsWithUserAndBookAndFine() {
    try {
      const borrows = await BorrowRepository.findAllWithUserAndBookAndFine();
      return borrows;
    } catch (error) {
      return [];
    }
  }
  static async getBorrowById(id) {
    try {
      const borrow = await BorrowRepository.findByIdWithUserAndBookAndFine(id);
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
      if (borrow.status !== "Đang mượn" && borrow.status !== "Quá hạn") {
        throw new Error(
          "Chỉ có thể trả sách đang mượn hoặc quá hạn và đã nộp phí phạt (nếu có)"
        );
      }
      borrow.status = "Đã trả";
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
        borrow.status !== "Đang yêu cầu mượn" &&
        borrow.status !== "Đã duyệt, chờ lấy"
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
        { status: "Đã hủy" },
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
      if (borrow.status !== "Đang yêu cầu mượn") {
        throw new Error("Chỉ có thể duyệt yêu cầu mượn đang chờ duyệt");
      }
      await BorrowRepository.update(
        borrow.id,
        { ...updateData, status: "Đã duyệt, chờ lấy" },
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
      if (borrow.status !== "Đang yêu cầu mượn") {
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
        { status: "Từ chối", approver_id },
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
      if (borrow.status !== "Đã duyệt, chờ lấy") {
        throw new Error("Chỉ có thể xác nhận lấy sách đã được duyệt");
      }
      borrow.status = "Đang mượn";
      borrow.pickup_date = new Date();
      await BorrowRepository.update(id, {
        status: "Đang mượn",
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
      if (borrow.status !== "Đang mượn") {
        throw new Error("Chỉ có thể đánh dấu quá hạn cho các mượn đang mượn");
      }
      await BorrowRepository.update(id, { status: "Quá hạn" });
      borrow.status = "Quá hạn";
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
}

module.exports = BorrowService;
