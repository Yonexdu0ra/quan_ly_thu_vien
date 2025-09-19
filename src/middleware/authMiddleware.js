const { decodeJWT, encodeJWT } = require("../utils/jwt");


const authMiddleware = async (req, res, next) => {
    try {

        const access_token = req.cookies.access_token;
        const refresh_token = req.cookies.refresh_token;
        const decodedAccessToken = await decodeJWT(access_token, process.env.JWT_SECRET);
        const decodedRefreshToken = await decodeJWT(refresh_token, process.env.JWT_SECRET);
        if (req.path.startsWith("/auth/login") && decodedAccessToken && decodedAccessToken !== "TokenExpiredError") {
            return res.redirect("/");
        }
        if (req.path.startsWith("/auth/login") && !decodedAccessToken || decodedAccessToken === "TokenExpiredError") {
            return next();
        }

        if (!access_token || !refresh_token) {
            return res.redirect("/auth/login");
        }

        
        if (decodedAccessToken === "TokenExpiredError" && decodedRefreshToken && decodedRefreshToken !== "TokenExpiredError") {
            // refresh token
            const newAccessToken = await encodeJWT({ id: decodedRefreshToken.id, role: decodedRefreshToken.role, user_id: decodedRefreshToken.user_id }, '15m');
            const TIME_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000;
            res.cookie("access_token", newAccessToken, { httpOnly: true, maxAge: TIME_COOKIE_EXPIRE, secure: false, sameSite: 'lax' });
        }
        if (!decodedAccessToken || !decodedRefreshToken) {
            return res.redirect("/auth/login");
        }
        req.user = decodedAccessToken;
        console.log(decodedAccessToken);
        
        next();
    } catch (error) {
       return res.redirect("/auth/login");
    }
};

module.exports = authMiddleware;
