const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const { sequelize, User, Account, Category, Author, Book, Borrow } = require("./models");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const bcrypt = require("bcrypt");
const BookService = require("./services/BookService");
const { STATUS_BORROW, STATUS_BORROW_REVERSE, BORROW_STATUS_CONSTANTS } = require("./utils/constants");
// const { importCategories, importAuthors, importAccountsAndUsers, importBooks } = require("./seeders");

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
    res.locals.borrowStatus = Object.entries(STATUS_BORROW);
    res.locals.borrowStatusMap = STATUS_BORROW;
    res.locals.borrowStatusReverse = STATUS_BORROW_REVERSE;
    res.locals.borrowStatusConstants = BORROW_STATUS_CONSTANTS;
    res.locals.currentPath = req.path;
    next();
});

routes(app);

app.get('/not-found', (req, res) => {
    res.status(404).render('notFound', { title: 'Không tìm thấy trang' });
});
app.get('/forbidden', (req, res) => {
    res.status(403).render('forbidden', { title: 'Không có quyền truy cập' });
});



(async () => {
    try {

        
        await sequelize.authenticate();
        
        // await sequelize.sync({ force: true });
        // importCategories(Category)
        // importAuthors(Author)
        // importAccountsAndUsers(Account, User, sequelize)
        // importBooks(Book, Author, Category)
        
        
        
        console.log("Kết nối tới MySQL thành công.");
    } catch (error) {
        console.error("Không thể kết nối tới MySQL:", error);
    }
})();


app.listen(3002, () => {
    console.log("Server is running on http://localhost:3002");
});
