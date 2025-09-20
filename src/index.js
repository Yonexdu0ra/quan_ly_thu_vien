const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const { sequelize, User, Account, Category, Author, Book } = require("./models");
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
app.set("layout extractScripts", true);

app.use(authMiddleware);
// câu hành nạp layout tự động dựa trên role
app.use((req, res, next) => {
    const role = req?.user?.role;
    const layout = !role ? false : role === 'Admin' ? 'layouts/admin' : role === 'Librarian' ? 'layouts/librarian' : 'layouts/reader';
    res.locals.layout = layout;
    res.locals.role = role;
    res.locals.fullname = req?.user?.fullname;
    res.locals.borrowStatus = ["Đang yêu cầu mượn", "Đã duyệt, chờ lấy", "Từ chối", "Đang mượn", "Đã trả", "Quá hạn", "Đã hủy"]
    next();
});

routes(app);

app.get("/", (req, res) => {
    res.render("index", { title: "Trang chủ" });
});

(async () => {
    try {

        // await sequelize.sync({ force: true });

        await sequelize.authenticate();
        // await sequelize.sync({ force: true})


        // await Category.create({ name: "Hài hước" });
        // await Category.create({ name: "Văn học" });
        // await Category.create({ name: "Kinh dị" });
        // await Category.create({ name: "Hành động" });


        // await Author.create({ name: "Nguyễn Nhật Ánh" });
        // await Author.create({ name: "Vũ Trọng Phụng" });
        // await Author.create({ name: "Stephen King" });

        // await Book.create({
        //     title: "Sống chết mặc bay",
        //     author_id: 1,
        //     category_id: 1,
        //     published_year: 1930,
        //     isbn: "1234567890123",
        //     quantity_total: 10,
        //     quantity_available: 10,
        //     image_cover: "https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png"
        // })
        // await Book.create({
        //     title: "Tuổi thơ dữ dội",
        //     author_id: 2,
        //     category_id: 2,
        //     published_year: 1988,
        //     isbn: "1234567890124",
        //     quantity_total: 5,
        //     quantity_available: 5,
        //     image_cover: "https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png"
        // })

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

        // const user2 = await User.create({
        //     fullname: "Nguyễm Mạnh Cường",
        //     email: "nmcuong@gmail.com",
        //     address: "Thái Nguyên",
        //     phone: "0123456789",

        // })
        // const account2 = await Account.create({
        //     username: "nmcuong",
        //     password: "123456",
        //     role: "Librarian",
        //     user_id: user2.id
        // })
        // const user3 = await User.create({
        //     fullname: "Dũng Os",
        //     email: "dungos@gmail.com"
        //     , address: "Thái Nguyên",
        //     phone: "0123456789",
        // })
        // const account3 = await Account.create({
        //     username: "dungos",
        //     password: "123456",
        //     role: "Reader",
        //     user_id: user3.id
        // })
        // console.log(user2);

        // console.log(account);
        console.log("Kết nối tới MySQL thành công.");
    } catch (error) {
        console.error("Không thể kết nối tới MySQL:", error);
    }
})();


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
