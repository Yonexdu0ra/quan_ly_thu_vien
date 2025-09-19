const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const { sequelize, User, Account } = require("./models");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

app.set("layout", "layout");


app.use(authMiddleware);

app.get("/", (req, res) => {
    res.render("index", { title: "Trang chủ" });
});

routes(app);

(async () => {
    try {
     
// await sequelize.sync({ force: true });

        await sequelize.authenticate();
        // await sequelize.sync({ force: true})

        // console.log(await Account.findAll());
        // const user = await User.create({
        //     fullname: "Phạm Ngọc Quý",
        //     email: "dtc225180267@ictu.edu.vn",
        //     address: "Thái Nguyên",
        //     phone: "0123456789",
        // })

        // const account = await Account.create({
        //     username: "admin",
        //     password: "admin123",
        //     role: "admin",
        //     user_id: user.id
        // })
        // console.log(user);

        // console.log(account);
        console.log("Kết nối tới MySQL thành công.");
    } catch (error) {
        console.error("Không thể kết nối tới MySQL:", error);
    }
})();


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
