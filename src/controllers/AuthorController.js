const { Author } = require("../models");
const AuthorService = require("../services/AuthorService");

class AuthController {
  static async index(req, res) {
    const { search, sort, page = 1, limit = 5 } = req.query;
    const { count, rows } = await AuthorService.getAllAuthors({
      search,
      sort,
      page,
      limit,
    });

    const currentPage = parseInt(page) || 1;
    const totalPages = Math.ceil(count / limit);
    return res.render("author/index", {
      title: "Quản lý tác giả",
      authors: rows,
      page: currentPage,
      totalPages,
      query: req.query,
    });
  }
  static add(req, res) {
    res.render("author/add", { title: "Thêm tác giả", oldData: {}, error: null });
  }
  static async edit(req, res) {
    const authorId = req.params.id;
    const author = await AuthorService.getAuthorById(authorId);
    if (!author) {
      return res.redirect('/not-found');
    }
    return res.render("author/edit", { title: "Chỉnh sửa tác giả", author, oldData: {}, error: null });
  }
  static async delete(req, res) {
    const authorId = req.params.id;
    const author = await AuthorService.getAuthorById(authorId);
    if (!author) {
      return res.redirect('/not-found');
    }
    return res.render("author/delete", { title: "Xóa tác giả", author });
  }
  static async detail(req, res) {
    try {
      const authorId = req.params.id;
      const author = await AuthorService.getAuthorWithBooksById(authorId);

      return res.render("author/detail", {
        title: "Chi tiết tác giả",
        author,
      });
    } catch (error) {
      return res.redirect('/not-found');
    }
  }
  static async addPost(req, res) {
    try {
      const { name, bio } = req.body;
      await AuthorService.createAuthor({ name, bio });
      return res.redirect("/authors");
    } catch (error) {
      return res.render("author/add", { title: "Thêm tác giả", oldData: req.body, error: error.message });
    }
  }
  static async editPost(req, res) {
    try {
      const authorId = req.params.id;
      const { name, bio } = req.body;
      const author = await AuthorService.getAuthorById(authorId);
      if (!author) {
        return res.redirect('/not-found');
      }
      await AuthorService.updateAuthor(authorId, { name, bio });
      return res.redirect("/authors");
    } catch (error) {
      return res.render("author/edit", { title: "Chỉnh sửa tác giả", oldData: req.body, error: error.message });
    }
  }
  static async deletePost(req, res) {
    const authorId = req.params.id;
    try {
      const author = await AuthorService.getAuthorById(authorId);
      if (!author) {
        return res.redirect('/not-found');
      }
      await AuthorService.deleteAuthor(authorId);
      return res.redirect("/authors");
    } catch (error) {
      return res.render("author/delete", { title: "Xóa tác giả", author: { id: authorId }, error: error.message });
    }
  }
}

module.exports = AuthController;
