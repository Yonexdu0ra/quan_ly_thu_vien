const { Category } = require("../models");
const CategoryService = require("../services/CategoryService");

class CategoryController {
  static async index(req, res) {
    const { search, sort, page = 1, limit = 5 } = req.query;
    const { count, rows } = await CategoryService.getAllCategories({
      search,
      sort,
      page,
      limit,
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = parseInt(page) || 1;

    return res.render("category/index", {
      title: "Quản lý danh mục",
      categories: rows || [],
      page: currentPage,
      totalPages,
      query: req.query,
    });
  }
  static add(req, res) {
    return res.render("category/add", { title: "Thêm danh mục", error: null, oldData: {} });
  }
  static async edit(req, res) {
    const categoryId = req.params.id;
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      return res.redirect('/not-found');
    }

    return res.render("category/edit", { title: "Chỉnh sửa danh mục", category, error: null });
  }
  static async delete(req, res) {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.redirect('/not-found');
    }
    return res.render("category/delete", { title: "Xóa danh mục", category });
  }
  static async detail(req, res) {
    const categoryId = req.params.id;
    const category = await CategoryService.getCategoryByIdWithBooks(categoryId);
    if (!category) {
      return res.redirect('/not-found');
    }
    return res.render("category/detail", { title: "Chi tiết danh mục", category });
  }
  static async addPost(req, res) {
    const { name } = req.body;
    await CategoryService.createCategory({ name });
    return res.redirect("/categories");
  }
  static async editPost(req, res) {
    const categoryId = req.params.id;
    const { name } = req.body;

    await CategoryService.updateCategory(categoryId, { name });
    return res.redirect("/categories");
  }
  static async deletePost(req, res) {
    const categoryId = req.params.id;
    try {
      // tìm danh mục theo id kèm sách
      const category = await CategoryService.getCategoryByIdWithBooks(categoryId);
      if (!category) throw new Error("Danh mục không tồn tại");
      // nếu danh mục có sách thì không cho xóa
      if (category.books && category.books.length > 0) throw new Error("Danh mục đang có sách, không thể xóa");
      await CategoryService.deleteCategory(categoryId);
      return res.redirect("/categories");
    } catch (error) {
      return res.render("category/delete", { title: "Xóa danh mục", category: { id: categoryId }, error: error.message });
    }
  }
}

module.exports = CategoryController;
