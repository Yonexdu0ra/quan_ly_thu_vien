const { Author } = require("../models");
const AuthorService = require("../services/AuthorService");




class AuthController {
    static async index(req, res) {
        const authors = await AuthorService.getAllAuthors();
        res.render("author/index", {
            title: "Quản lý tác giả", authors
        });
    }
    static add(req, res) {
        res.render("author/add", { title: "Thêm tác giả" });
    }
    static async edit(req, res) {
        const authorId = req.params.id;
        const author = await AuthorService.getAuthorById(authorId);
        if (!author) {
            return res.status(404).send("Tác giả không tồn tại");
        }
        res.render("author/edit", { title: "Chỉnh sửa tác giả", author });
    }
    static async delete(req, res) {
        const authorId = req.params.id;
        const author = await AuthorService.getAuthorById(authorId);
        if (!author) {
            return res.status(404).send("Tác giả không tồn tại");
        }
        res.render("author/delete", { title: "Xóa tác giả", author });
    }
    static async detail(req, res) {
        const authorId = req.params.id;
        const author = await Author.findByPk(authorId);
        if (!author) {
            return res.status(404).send("Tác giả không tồn tại");
        }
        res.render("author/detail", { title: "Chi tiết tác giả", author });
    }
    static async addPost(req, res) {
        const { name, bio } = req.body;
        await AuthorService.createAuthor({ name, bio });
        res.redirect("/authors");
    }
    static async editPost(req, res) {
        const authorId = req.params.id;
        const { name, bio } = req.body;
        const author = await AuthorService.getAuthorById(authorId);
        if (!author) {
            return res.status(404).send("Tác giả không tồn tại");
        }
        await AuthorService.updateAuthor(authorId, { name, bio });
        res.redirect("/authors");
    }
    static async deletePost(req, res) {
        const authorId = req.params.id;
        const author = await AuthorService.getAuthorById(authorId);
        if (!author) {
            return res.status(404).send("Tác giả không tồn tại");
        }
        await AuthorService.deleteAuthor(authorId);
        res.redirect("/authors");
    }
}


module.exports = AuthController;