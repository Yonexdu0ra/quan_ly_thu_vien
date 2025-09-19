const jwt = require("jsonwebtoken");

const encodeJWT = async (payload, expiresIn) => {
    try {
        return  jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: expiresIn || "1h",
        });
    } catch (error) {
        return null;
    }
};

const decodeJWT = async (token) => {
    try {
        return  jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
    } catch (error) {
        if(error.name === "TokenExpiredError") return "TokenExpiredError";
        return null;
    }
};

module.exports = { encodeJWT, decodeJWT };