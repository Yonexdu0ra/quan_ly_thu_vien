const UserService = require("../services/UserService");

class UserController {

    static async index(req, res) {
        const users = await UserService.getAllUsers();
        return res.render("user/index", { title: "Quản lý người dùng", users });
    }

    static async edit(req, res) {
       try {
         const userId = req.params.id;
         const user = await UserService.getUserById(userId);

         return res.render("user/edit", {
           title: "Chỉnh sửa người dùng",
           user,
         });
       } catch (error) {
        return res.redirect("/not-found");
       }
    }
    static async detail(req, res) {
         try {
           const userId = req.params.id;
           const user = await UserService.getUserById(userId);
            if(!user) {
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
            return res.redirect("/not-found");
        }
    }
}

module.exports = UserController