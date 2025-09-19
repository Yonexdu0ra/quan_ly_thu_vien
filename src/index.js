const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const sequelize = require("./config/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);


app.set("layout", "layout");

app.get("/", (req, res) => {
    res.render("index", { title: "Trang chủ" });
});


(async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối tới MySQL thành công.");
    } catch (error) {
        console.error("Không thể kết nối tới MySQL:", error);
    }
})();


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
