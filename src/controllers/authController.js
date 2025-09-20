const AccountService = require("../services/AccountService");
const { encodeJWT } = require("../utils/jwt");



class AuthController {
    static async viewLogin(req, res) {
        try {
            return res.render("login", { title: "Đăng nhập" });
        } catch (error) {
            return res.status(500).render("login", { title: "Đăng nhập", error: "Đã xảy ra lỗi", layout: false });
        }
    }
    static async login(req, res) {
        const { username, password } = req.body;
        try {
            const account = await AccountService.getAccountByUsername(username);
           
            
            // console.log(account.toJSON());
            if (!account) {
                return res.status(401).render("login", { title: "Đăng nhập", error: "Tài khoản không tồn tại", layout: false });
            }
            if (account.password !== password) {
                return res.status(401).render("login", { title: "Đăng nhập", error: "Mật khẩu không chính xác", layout: false });
            }

            const encodeData = { id: account.id, role: account.role, user_id: account.user_id, fullname: account.user.fullname }
            const access_token = await encodeJWT(encodeData, '15m');
            const refresh_token = await encodeJWT(encodeData, '7d');
            // console.log(access_token);

            const TIME_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;+
            res.cookie("access_token", access_token, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });
            res.cookie("refresh_token", refresh_token, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });
            return res.redirect("/");
        } catch (error) {
            return res.status(500).render("login", { title: "Đăng nhập", error: "Đã xảy ra lỗi" });
        }
    }
}

module.exports = AuthController;