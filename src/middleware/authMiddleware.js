const { decodeJWT, encodeJWT } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
    try {
        const access_token = req.cookies.access_token;
        const refresh_token = req.cookies.refresh_token;
        const isPathLogin = req.path.startsWith("/auth/login");

        let decodedAccessToken = access_token ? await decodeJWT(access_token, process.env.JWT_SECRET) : null;
        const decodedRefreshToken = refresh_token ? await decodeJWT(refresh_token, process.env.JWT_SECRET) : null;

        // Đã đăng nhập mà muốn vào trang login → redirect về home
        if (isPathLogin && decodedAccessToken && decodedAccessToken !== "TokenExpiredError") {
            return res.redirect("/");
        }

        // Chưa có token hoặc refresh token invalid → redirect về login nếu không phải trang login
        if ((!decodedAccessToken || !decodedRefreshToken || decodedRefreshToken === "JsonWebTokenError") && !isPathLogin) {
            return res.redirect("/auth/login");
        }

        // Access token hết hạn nhưng refresh token còn hạn → tạo access token mới
        if (decodedAccessToken === "TokenExpiredError" && decodedRefreshToken && decodedRefreshToken !== "TokenExpiredError") {
            const newAccessToken = await encodeJWT(
                { id: decodedRefreshToken.id, role: decodedRefreshToken.role, user_id: decodedRefreshToken.user_id, fullname: decodedRefreshToken.fullname },
                '15m'
            );

            const TIME_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;
            res.cookie("access_token", newAccessToken, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });

            decodedAccessToken = await decodeJWT(newAccessToken, process.env.JWT_SECRET);
        }

        // Gán user vào req
        if (decodedAccessToken && decodedAccessToken !== "TokenExpiredError") {
            req.user = decodedAccessToken;
        }

        next();
    } catch (error) {
        return res.redirect("/auth/login");
    }
};

module.exports = authMiddleware;
