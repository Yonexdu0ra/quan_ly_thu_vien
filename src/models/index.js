const sequelize = require("../config/database");
const User = require("./User");
const Book = require("./Book");
const Author = require("./Author");
const Category = require("./Category");
const Borrow= require("./Borrow");
const Fine = require("./Fine");
const Account = require("./Account");

// User - Account: 1-1
User.hasOne(Account, { foreignKey: "userId", as: "account" });
Account.belongsTo(User, { foreignKey: "userId", as: "user" });

// Category - Book: 1-N
Category.hasMany(Book, { foreignKey: "category_id", as: "books" });
Book.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Author - Book: 1-N
Author.hasMany(Book, { foreignKey: "author_id", as: "books" });
Book.belongsTo(Author, { foreignKey: "author_id", as: "author" });

// Book - Borrow: 1-N
Book.hasMany(Borrow, { foreignKey: "book_id", as: "borrows" });
Borrow.belongsTo(Book, { foreignKey: "book_id", as: "book" });

// User (người mượn) - Borrow
User.hasMany(Borrow, { foreignKey: "borrow_id", as: "borrows" });
Borrow.belongsTo(User, { foreignKey: "borrow_id", as: "borrower" });

// User (người duyệt) - Borrow
User.hasMany(Borrow, { foreignKey: "approver_id", as: "approvedBorrows" });
Borrow.belongsTo(User, { foreignKey: "approver_id", as: "approver" });

// Borrow - Fine: 1-1
Borrow.hasOne(Fine, { foreignKey: "borrow_id", as: "fine" });
Fine.belongsTo(Borrow, { foreignKey: "borrow_id", as: "borrow" });

export {
    User,
    Book,
    Author,
    Category,
    Borrow,
    Fine,
    Account,
    sequelize
}
