


const ADMIN_ROLE = "Admin";
const LIBRARIAN_ROLE = "Librarian";
const READER_ROLE = "Reader";


const requiredRoleLibraries = (req, res, next) => {
    if (req.user.role !== LIBRARIAN_ROLE) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

const requiredRoleAdmin = (req, res, next) => {
    if (req.user.role !== ADMIN_ROLE) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};


const requiredRoleReaderOrLibrarian = (req, res, next) => {
    if (req.user.role !== READER_ROLE && req.user.role !== LIBRARIAN_ROLE) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};


const requireRoleLibrarianOrAdmin = (req, res, next) => {
    if (req.user.role !== LIBRARIAN_ROLE && req.user.role !== ADMIN_ROLE) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}


module.exports = {
    requiredRoleLibraries,
    requiredRoleAdmin,
    requiredRoleReaderOrLibrarian,
    requireRoleLibrarianOrAdmin
};
