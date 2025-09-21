



const requiredRoleLibraries = (req, res, next) => {
    if (req.user.role !== "Librarian") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

const requiredRoleAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};


const requiredRoleReaderAndLibrarian = (req, res, next) => {
    if (req.user.role !== "Reader" && req.user.role !== "Librarian") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};



module.exports = {
    requiredRoleLibraries,
    requiredRoleAdmin,
    requiredRoleReaderAndLibrarian
};
