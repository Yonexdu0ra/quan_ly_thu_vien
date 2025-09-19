

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const Category = sequelize.define("Categories", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Tên danh mục không được để trống" },
            len: { args: [3, 100], msg: "Tên danh mục phải từ 3 đến 100 ký tự" }
        }
    }
}, {
    tableName: "categories",
    timestamps: true
})


module.exports = Category;