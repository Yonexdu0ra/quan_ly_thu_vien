const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const authorRoute = require("./authorRoute");
const bookRoute = require("./bookRoute");
const borrowRoute = require("./borrowRoute");
const accountRoute = require("./accountRoute");
const fineRoute = require("./fineRoute");
const reportRoute = require("./reportRoute");
const { requiredRoleAdmin, requiredRoleLibraries, requiredRoleReaderOrLibrarian, requireRoleLibrarianOrAdmin } = require('../middleware/authorization')
const routes = (app) => {
    app.use("/auth", authRoute);
    app.use("/categories", requireRoleLibrarianOrAdmin, categoryRoute);
    app.use("/authors", requireRoleLibrarianOrAdmin, authorRoute);
    app.use("/books", bookRoute);
    app.use("/borrows", borrowRoute);
    app.use("/accounts", requiredRoleAdmin, accountRoute);
    app.use("/fines", fineRoute);
    app.use("/reports", requiredRoleAdmin, reportRoute);
};

module.exports = routes;