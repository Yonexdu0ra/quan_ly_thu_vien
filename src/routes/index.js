const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const authorRoute = require("./authorRoute");
const bookRoute = require("./bookRoute");
const borrowRoute = require("./borrowRoute");
const accountRoute = require("./accountRoute");
const routes = (app) => {
    app.use("/auth", authRoute);
    app.use("/categories", categoryRoute);
    app.use("/authors", authorRoute);
    app.use("/books", bookRoute);
    app.use("/borrows", borrowRoute);
    app.use("/accounts", accountRoute);
};

module.exports = routes;