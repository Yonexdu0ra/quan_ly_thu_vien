const BookRepository = require("../repositories/BookRepository");

class BookService {
  static async getAllBooksWithAuthorAndCategory({
    search,
    sort = "",
    page = 1,
    limit = 5,
  } = {}) {
    try {
      const sortBy = [
        "published_year",
        "quantity_total",
        "quantity_available",
      ].includes(sort.split("-")[0])
        ? sort.split("-")[0]
        : "published_year";
      const order = sort.includes("DESC") ? "DESC" : "ASC";
      const books = await BookRepository.findAllWithAuthorAndCategory({
        search,
        sortBy,
        order,
        page,
        limit,
      });

      return books;
    } catch (error) {
      return [];
    }
  }
  static async getAllBooks({ search, sort = "", page = 1, limit = 5 } = {}) {
    try {
      const order = sort.includes("DESC") ? "DESC" : "ASC";

     const sortBy = [
       "published_year",
       "quantity_total",
       "quantity_available",
     ].includes(sort.split("-")[0])
       ? sort.split("-")[0]
       : "published_year";
      const books = BookRepository.findAll({
        search,
        sortBy,
        order,
        page,
        limit,
      });
    //   console.log(books);

      return books;
    } catch (error) {
      console.error("Error fetching books:", error.message);
      return {
        count: 0,
        rows: [],
      };
    }
  }
  static async getBookById(id) {
    try {
      const book = await BookRepository.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    } catch (error) {
      throw error;
    }
  }
  static async getBookByIdWithAuthorAndCategory(id) {
    try {
      const book = await BookRepository.findByIdWithAuthorAndCategory(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    } catch (error) {
      throw error;
    }
  }
  static async createBook(bookData) {
    try {
      if (bookData.quantity_total < bookData.quantity_available) {
        throw new Error("Số lượng có sẵn không được lớn hơn tổng số lượng");
      }
      const newBook = await BookRepository.create(bookData);
      return newBook;
    } catch (error) {
      throw error;
    }
  }
  static async updateBook(id, bookData) {
    try {
      if (bookData.quantity_total < bookData.quantity_available) {
        throw new Error("Số lượng có sẵn không được lớn hơn tổng số lượng");
      }
      const book = await BookRepository.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      await book.update(bookData);
      return book;
    } catch (error) {
      throw error;
    }
  }
  static async deleteBook(id) {
    try {
      const book = await BookRepository.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      await BookRepository.delete(id);
      return book;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookService;
