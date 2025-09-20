const { Account, User, sequelize } = require("../models");
// const bcrypt = require("bcryptjs"); // nếu muốn hash password

class AccountController {
    // Hiển thị danh sách tài khoản
    static async index(req, res) {
        const accounts = await Account.findAll({
            include: [{ model: User, as: 'user' }]
        });
        res.render("account/index", { title: "Quản lý tài khoản", accounts });
    }

    // Hiển thị form thêm tài khoản
    static async add(req, res) {
        res.render("account/add", { title: "Thêm tài khoản" });
    }

    // Xử lý POST thêm tài khoản + user
    static async addPost(req, res) {
        const t = await sequelize.transaction();
        try {
            const { username, password, role, fullname, email, address, phone } = req.body;

            // Tạo User trước
            const user = await User.create({ fullname, email, address, phone }, { transaction: t });

            // Hash password nếu muốn
            // const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo Account liên kết với user
            await Account.create({
                username,
                password: password,
                role,
                user_id: user.id
            }, { transaction: t });

            await t.commit();
            res.redirect("/accounts");
        } catch (err) {
            await t.rollback();
            console.error(err);
            res.status(500).send("Có lỗi xảy ra khi tạo tài khoản");
        }
    }

    // Hiển thị form chỉnh sửa tài khoản
    static async edit(req, res) {
        const accountId = req.params.id;
        const account = await Account.findByPk(accountId, {
            include: [{ model: User, as: 'user' }]
        });
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        res.render("account/edit", { title: "Chỉnh sửa tài khoản", account });
    }

    // Xử lý POST chỉnh sửa tài khoản + user
    static async editPost(req, res) {
        try {
            const accountId = req.params.id;
            const account = await Account.findByPk(accountId, {
                include: [{ model: User, as: 'user' }]
            });
            if (!account) return res.status(404).send("Tài khoản không tồn tại");

            const { username, role, fullname, email, address, phone, password } = req.body;

            account.username = username;
            account.role = role;
            if (password && password.trim() !== "") {
                account.password = await bcrypt.hash(password, 10);
            }
            await account.save();

            // Cập nhật thông tin User
            if (account.user) {
                account.user.fullname = fullname;
                account.user.email = email;
                account.user.address = address;
                account.user.phone = phone;
                await account.user.save();
            }

            res.redirect("/accounts");
        } catch (err) {
            console.error(err);
            res.status(500).send("Có lỗi xảy ra khi cập nhật tài khoản");
        }
    }

    // Hiển thị chi tiết tài khoản
    static async detail(req, res) {
        const accountId = req.params.id;
        const account = await Account.findByPk(accountId, {
            include: [{ model: User, as: 'user' }]
        });
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        res.render("account/detail", { title: "Chi tiết tài khoản", account });
    }

    // Hiển thị form xóa
    static async delete(req, res) {
        const accountId = req.params.id;
        const account = await Account.findByPk(accountId, {
            include: [{ model: User, as: 'user' }]
        });
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        res.render("account/delete", { title: "Xóa tài khoản", account });
    }

    // Xử lý POST xóa tài khoản
    static async deletePost(req, res) {
        const accountId = req.params.id;
        const account = await Account.findByPk(accountId, {
            include: [{ model: User, as: 'user' }]
        });
        if (!account) return res.status(404).send("Tài khoản không tồn tại");

        // Xóa account trước, user nếu muốn cũng xóa theo
        await account.destroy();
        if (account.user) await account.user.destroy();

        res.redirect("/accounts");
    }
}

module.exports = AccountController;
