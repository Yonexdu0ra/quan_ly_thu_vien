const authRoute = require("./authRoute");



const routes = (app) => {
    app.use("/auth", authRoute);
};

module.exports = routes;