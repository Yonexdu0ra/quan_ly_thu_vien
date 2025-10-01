const UserService = require("../services/UserService");

class UserController {

  static async index(req, res) {
    const { search, sort, page, limit } = req.query;
    const { count, rows: users } = await UserService.getAllUsers({ search, sort, page, limit });
    // console.log(users);

    const currentPage = parseInt(page) || 1;
    const totalPages = Math.ceil(count / limit) || 1;
    return res.render("user/index", { title: "Quản lý người dùng", users, totalPages, page: currentPage, query: req.query });
  }

  static async edit(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);

      return res.render("user/edit", {
        title: "Chỉnh sửa người dùng",
        user,
        error: null,
      });
    } catch (error) {
      return res.render("user/edit", {
        title: "Chỉnh sửa người dùng",
        error: error.message,

      })
    }
  }
  static async detail(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return res.render("user/detail", {
        title: "Chi tiết người dùng",
        user,
      });
    } catch (error) {
      return res.redirect("/not-found");
    }
  }
  static async updatePost(req, res) {
    try {
      const userId = req.params.id;
      const { fullname, email, phone } = req.body;
      await UserService.updateUser(userId, { fullname, email, phone });
      return res.redirect(`/users/${userId}`);
    } catch (error) {
      return res.render("user/edit", {
        title: "Chỉnh sửa người dùng",
        error: error.message,
        user: { id: req.params.id, ...req.body }
      })
    }
  }
}

module.exports = UserController