const bcrypt = require('bcrypt');
const accountRepository = require('../repositories/AccountRepository');
const { encodeJWT } = require('../utils/jwt');


class AuthService {


    static async login(username, password) {
        try {
            const account = await accountRepository.findByUsernameWithUser(username);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            const isPasswordValid = await bcrypt.compare(password, account.password);
            // const isPasswordValid = password === account.password;
            if (!isPasswordValid) {
                throw new Error("Mật khẩu không đúng");
            }
            const encodeData = { id: account.id, role: account.role, user_id: account.user_id, fullname: account.user.fullname };
            const access_token = await encodeJWT(encodeData, '15m');
            const refresh_token = await encodeJWT(encodeData, '7d');

            return { access_token, refresh_token };
        } catch (error) {
            throw error;
        }
    }

    static async changePassword(accountId, password, newPassword, confirmPassword) {
        try {
            const account = await accountRepository.findById(accountId);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            const isPasswordValid = await bcrypt.compare(password, account.password);
            if (!isPasswordValid) {
                throw new Error("Mật khẩu hiện tại không chính xác");
            }
            if (newPassword !== confirmPassword) {
                throw new Error("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
            }
            account.password = await bcrypt.hash(newPassword, 10);
            await account.save();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
    static async logout() {
        return true
    }



}

module.exports = AuthService;