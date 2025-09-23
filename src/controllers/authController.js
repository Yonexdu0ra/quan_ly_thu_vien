const AccountService = require("../services/AccountService");
const authService = require("../services/AuthService");


class AuthController {
    static async viewLogin(req, res) {
        try {
            return res.render("login", { title: "Đăng nhập" });
        } catch (error) {
            return res.status(500).render("login", { title: "Đăng nhập", error: "Đã xảy ra lỗi", layout: false });
        }
    }
    static async logout(req, res) {
        await authService.logout();
        res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: 'lax' });
        res.clearCookie("refresh_token", { httpOnly: true, secure: false, sameSite: 'lax' });
        return res.redirect("/auth/login");
    }
    static async login(req, res) {
        const { username, password } = req.body;
        try {
            const { access_token, refresh_token } = await authService.login(username, password);
            const TIME_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;
            res.cookie("access_token", access_token, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });
            res.cookie("refresh_token", refresh_token, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });
            return res.redirect("/");
        } catch (error) {
            return res.status(500).render("login", { title: "Đăng nhập", error: error.message });
        }
    }
    static async viewChangePassword(req, res) {
        return res.render("changePassword", { title: "Đổi mật khẩu" });
    }
    static async changePassword(req, res) {
        const accountId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;
        try {
            await authService.changePassword(accountId, currentPassword, newPassword, confirmPassword);
            return res.render("changePassword", { title: "Đổi mật khẩu", success: "Đổi mật khẩu thành công" });
        } catch (error) {
            return res.status(500).render("changePassword", { title: "Đổi mật khẩu", error: error.message });
        }
    }
}


module.exports = AuthController;