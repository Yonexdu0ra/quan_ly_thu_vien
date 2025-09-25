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
    res.render("category/add", { title: "Thêm danh mục" });
  }
  static async edit(req, res) {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).send("Danh mục không tồn tại");
    }

    res.render("category/edit", { title: "Chỉnh sửa danh mục", category });
  }
  static async delete(req, res) {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).send("Danh mục không tồn tại");
    }
    res.render("category/delete", { title: "Xóa danh mục", category });
  }
  static async detail(req, res) {
    const categoryId = req.params.id;
    const category = await CategoryService.getCategoryByIdWithBooks(categoryId);
    if (!category) {
      return res.status(404).send("Danh mục không tồn tại");
    }
    res.render("category/detail", { title: "Chi tiết danh mục", category });
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
    await CategoryService.deleteCategory(categoryId);
    return res.redirect("/categories");
  }
}

module.exports = CategoryController;
