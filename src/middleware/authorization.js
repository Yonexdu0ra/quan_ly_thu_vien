



const requiredRoleLibraries = (req, res, next) => {
    if (req.user.role !== "Librarian") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

const requiredRoleAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

module.exports = {
    requiredRoleLibraries,
    requiredRoleAdmin
};
