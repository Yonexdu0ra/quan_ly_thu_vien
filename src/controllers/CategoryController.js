

const { Category } = require("../models");

class CategoryController {
    static async index(req, res) {
        const categories = await Category.findAll();
        res.render("category/index", {
            title: "Quản lý danh mục", categories
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
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).send("Danh mục không tồn tại");
        }
        res.render("category/detail", { title: "Chi tiết danh mục", category });
    }
    static async addPost(req, res) {
        const { name } = req.body;
        await Category.create({ name });
        res.redirect("/categories");
    }
    static async editPost(req, res) {
        const categoryId = req.params.id;
        const { name } = req.body;
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).send("Danh mục không tồn tại");
        }
        category.name = name;
        await category.save();
        res.redirect("/categories");
    }
    static async deletePost(req, res) {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).send("Danh mục không tồn tại");
        }
        await category.destroy();
        res.redirect("/categories");
    }
}


module.exports = CategoryController;