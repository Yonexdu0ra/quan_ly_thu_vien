

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const Account = sequelize.define("Account", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Tên đăng nhập không được để trống" },
            len: { args: [3, 25], msg: "Tên đăng nhập phải từ 3 đến 25 ký tự" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Mật khẩu không được để trống" },
            len: { args: [6, 100], msg: "Mật khẩu phải từ 6 đến 100 ký tự" }
        }
    },
    role: {
        type: DataTypes.ENUM("Admin", "Librarian", "Reader"),
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "accounts",
    timestamps: true
})


export default Account;