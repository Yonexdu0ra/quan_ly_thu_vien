const { Account, User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const AccountService = require("../services/AccountService");
const UserService = require("../services/UserService");
class AccountController {
    // Hiển thị danh sách tài khoản
    static async index(req, res) {
        const { count, rows: accounts } = await AccountService.getAllAccounts()
        const currentPage = parseInt(req.query.page) || 1;
        const totalPages = Math.ceil(count / 10);
        return res.render("account/index", { title: "Quản lý tài khoản", accounts, totalPages, page: currentPage, query: req.query });
    }

    // Hiển thị form thêm tài khoản
    static async add(req, res) {
        return res.render("account/add", { title: "Thêm tài khoản", error: null });
    }

    // Xử lý POST thêm tài khoản + user
    static async addPost(req, res) {
        const t = await sequelize.transaction();
        try {
            const { username, password, role, fullname, email, address, phone } = req.body;


            const account = await AccountService.getAccountByUsername(username);
            if (account) throw new Error("Username đã tồn tại");
            const newUser = await User.create({
                fullname,
                email,
                address,
                phone
            }, { transaction: t });
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAccount = await Account.create({
                username,
                password: hashedPassword,
                role,
                user_id: newUser.id
            }, { transaction: t });

            await t.commit();
            return res.redirect("/accounts");
        } catch (err) {
            await t.rollback();
            console.error(err);
            return res.status(500).send("Có lỗi xảy ra khi tạo tài khoản");
        }
    }

    // Hiển thị form chỉnh sửa tài khoản
    static async edit(req, res) {
        const accountId = req.params.id;
        const account = await AccountService.getAccountByIdWithUser(accountId);
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        return res.render("account/edit", { title: "Chỉnh sửa tài khoản", account, error: null });
    }

    // Xử lý POST chỉnh sửa tài khoản + user
    static async editPost(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const accountId = req.params.id;

            const { username, role, fullname, email, address, phone, password } = req.body;
            const account = await AccountService.getAccountById(accountId);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            await AccountService.updateAccount(accountId, {
                username: username.trim(),
                role: role.trim(),
            }, { transaction });


            await UserService.updateUser(account.user_id, {
                fullname: fullname.trim(),
                email: email.trim(),
                address: address.trim(),
                phone: phone.trim(),
            }, { transaction });

            await transaction.commit();


            return res.redirect("/accounts");
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return res.status(500).send("Có lỗi xảy ra khi cập nhật tài khoản");
        }
    }

    // Hiển thị chi tiết tài khoản
    static async detail(req, res) {
        const accountId = req.params.id;
        const account = await AccountService.getAccountByIdWithUser(accountId);
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        return res.render("account/detail", { title: "Chi tiết tài khoản", account });
    }

    // Hiển thị form xóa
    static async delete(req, res) {
        const accountId = req.params.id;
        const account = await AccountService.getAccountByIdWithUser(accountId);

        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        return res.render("account/delete", { title: "Xóa tài khoản", account, error: null });
    }

    // Xử lý POST xóa tài khoản
    static async deletePost(req, res) {
        const transaction = await sequelize.transaction();
        const accountId = req.params.id;
        try {
            const account = await AccountService.getAccountById(accountId);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            const a = await AccountService.deleteAccount(account.id, { transaction });
            const u = await UserService.deleteUser(account.user_id, { transaction });

            await transaction.commit();
            return res.redirect("/accounts");
        } catch (error) {
            console.error(error);
            await transaction.rollback();
            const account = await AccountService.getAccountById(accountId);
            return res.render("account/delete", { title: "Xóa tài khoản", account, error: error.message });
        }
    }
}

module.exports = AccountController;
