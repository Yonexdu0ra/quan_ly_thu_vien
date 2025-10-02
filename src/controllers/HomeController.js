const BookService = require("../services/BookService");
const CategoryService = require("../services/CategoryService");
class HomeController {
    static async index(req, res) {
        const { count: totalBooks, rows: books } = await BookService.getAllBooks({ page: 1, limit: 6 });
        const { count: totalCategories, rows: categories } = await CategoryService.getAllNoPagination();
        return res.render("index", { title: "Trang chủ", books, categories });
    }


}
module.exports = HomeController;