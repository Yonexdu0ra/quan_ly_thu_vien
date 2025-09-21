const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const authorRoute = require("./authorRoute");
const bookRoute = require("./bookRoute");
const borrowRoute = require("./borrowRoute");
const accountRoute = require("./accountRoute");
const { requiredRoleAdmin, requiredRoleLibraries } = require('../middleware/authorization')
const routes = (app) => {
    app.use("/auth", authRoute);
    app.use("/categories", requiredRoleLibraries, categoryRoute);
    app.use("/authors", requiredRoleLibraries, authorRoute);
    app.use("/books", requiredRoleLibraries, bookRoute);
    app.use("/borrows", borrowRoute);
    app.use("/accounts", requiredRoleAdmin, accountRoute);
};

module.exports = routes;