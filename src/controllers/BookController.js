const { Book, Author, Category } = require("../models");


class BookController {
    static async index(req, res) {
        const books = await Book.findAll({
            include: [{ model: Author, as: 'author' }, { model: Category, as: 'category' }]
        });
        // console.log(books);
        
        res.render("book/index", {
            title: "Quản lý sách", books
        });
    }
    static async add(req, res) {
        const authors = await Author.findAll();
        const categories = await Category.findAll();
        res.render("book/add", { title: "Thêm sách", authors, categories });
    }
    static async edit(req, res) {
        const bookId = req.params.id;
        const authors = await Author.findAll();
        const categories = await Category.findAll();
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).send("Sách không tồn tại");
        }
        res.render("book/edit", { title: "Chỉnh sửa sách", book, authors, categories });
    }
    static async delete(req, res) {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).send("Sách không tồn tại");
        }
        res.render("book/delete", { title: "Xóa sách", book });
    }
    static async detail(req, res) {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId, {
            include: [{ model: Author, as: 'author' }, { model: Category, as: 'category' }]
        });
        if (!book) {
            return res.status(404).send("Sách không tồn tại");
        }
        res.render("book/detail", { title: "Chi tiết sách", book });
    }
    static async addPost(req, res) {
        const { title, author_id, category_id, published_year, isbn, quantity_total, quantity_available, image_cover } = req.body;
        console.log(req.body);

        const book = await Book.create({ title, author_id, category_id, published_year, isbn, quantity_total, quantity_available, image_cover });
        console.log(book.dataValues);
        
        res.redirect("/books");
    }
    static async editPost(req, res) {
        const bookId = req.params.id;
        const { title, author_id, category_id, published_year, isbn, quantity_total, quantity_available, image_cover } = req.body;
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).send("Sách không tồn tại");
        }
        book.title = title;
        book.author_id = author_id;
        book.category_id = category_id;
        book.published_year = published_year;
        book.isbn = isbn;
        book.quantity_total = quantity_total;
        book.quantity_available = quantity_available;
        book.image_cover = image_cover;
        await book.save();
        res.redirect("/books");
    }
    static async deletePost(req, res) {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).send("Sách không tồn tại");
        }
        await book.destroy();
        res.redirect("/books");
    }

}

module.exports = BookController;