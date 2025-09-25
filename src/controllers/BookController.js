const { Book, Author, Category } = require("../models");
const BookService = require("../services/BookService");
const AuthorService = require("../services/AuthorService");
const CategoryService = require("../services/CategoryService");
class BookController {
  static async index(req, res) {
    const { search, sort = "", page = 1, limit = 5 } = req.query;
    // console.log(sort);

    const { count, rows } = await BookService.getAllBooksWithAuthorAndCategory({
      search,
      sort,
      page,
      limit,
    });
    // console.log(books);

    return res.render("book/index", {
      title: "Quản lý sách",
      books: rows,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(count / limit),
      query: req.query,
    });
  }
  static async add(req, res) {
    const { rows: authors } = await AuthorService.getAllAuthors();
    const { rows: categories } = await CategoryService.getAllCategories();
    return res.render("book/add", {
      title: "Thêm sách",
      authors,
      categories,
      error: null,
      oldData: {},
    });
  }
  static async edit(req, res) {
    const bookId = req.params.id;
    const book = await BookService.getBookById(bookId);
    if (!book) {
      return res.status(404).send("Sách không tồn tại");
    }
    const { rows: authors} = await AuthorService.getAllAuthors();
    const { rows: categories } = await CategoryService.getAllCategories();
    return res.render("book/edit", {
      title: "Chỉnh sửa sách",
      book,
      authors,
      categories,
      error: null,
      oldData: {},
    });
  }
  static async delete(req, res) {
    const bookId = req.params.id;
    const book = await BookService.getBookById(bookId);
    if (!book) {
      return res.status(404).send("Sách không tồn tại");
    }
    return res.render("book/delete", { title: "Xóa sách", book, error: null });
  }
  static async detail(req, res) {
    try {
      const bookId = req.params.id;
      const book = await BookService.getBookByIdWithAuthorAndCategory(bookId);

      return res.render("book/detail", { title: "Chi tiết sách", book });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  static async addPost(req, res) {
    try {
      const {
        title,
        author_id,
        category_id,
        published_year,
        isbn,
        quantity_total,
        quantity_available,
        description,
      } = req.body;

      const image_cover = req.file.path;
      //   if (quantity_total < quantity_available) {
      //     return res
      //       .status(400)
      //       .send("Số lượng có sẵn không thể lớn hơn tổng số lượng");
      //   }

      const book = await BookService.createBook({
        title,
        author_id,
        category_id,
        published_year,
        isbn,
        quantity_total,
        quantity_available,
        image_cover,
        description,
      });

      return res.redirect("/books");
    } catch (error) {
      return res.render("/books/add", {
        title: "Thêm sách",
        error: error.message,
        oldData: req.body,
      });
    }
  }
  static async editPost(req, res) {
    try {
      const bookId = req.params.id;
      const {
        title,
        author_id,
        category_id,
        published_year,
        isbn,
        quantity_total,
        quantity_available,
        description,
      } = req.body;
      const image_cover = req.file.path;
      // if (quantity_total < quantity_available) {
      //   return res
      //     .status(400)
      //     .send("Số lượng có sẵn không thể lớn hơn tổng số lượng");
      // }
      // console.log(req.file);
      // console.log(req.files);

      const book = await BookService.updateBook(bookId, {
        title,
        author_id,
        category_id,
        published_year,
        isbn,
        quantity_total,
        quantity_available,
        description,
        image_cover,
      });

      return res.redirect("/books");
    } catch (error) {
      return res.render("/books/edit", {
        title: "Chỉnh sửa sách",
        error: error.message,
        oldData: req.body,
      });
    }
  }
  static async deletePost(req, res) {
    try {
      const bookId = req.params.id;
      await BookService.deleteBook(bookId);
      return res.redirect("/books");
    } catch (error) {
      return res.render("/books/delete", {
        title: "Xóa sách",
        error: error.message,
        oldData: req.body,
      });
    }
  }
}

module.exports = BookController;
