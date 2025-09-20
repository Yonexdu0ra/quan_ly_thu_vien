

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Borrow = sequelize.define("Borrows", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: { msg: "Ngày mượn không hợp lệ" },
            notNull: { msg: "Ngày mượn không được để trống" },

        },
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: { msg: "Ngày trả không hợp lệ" },
            isAfter: { args: new Date().toISOString(), msg: "Ngày trả phải sau ngày mượn" },
            // notNull: { msg: "Ngày trả không được để trống" }
        }
    },
    pickup_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: { msg: "Ngày lấy không hợp lệ" },
        }
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: "Ngày đến hạn không hợp lệ" },
            isAfter: { args: new Date().toISOString(), msg: "Ngày đến hạn phải sau ngày mượn" },
            notNull: { msg: "Ngày đến hạn không được để trống" }
        }
    },
    status: {
        type: DataTypes.ENUM("Đang yêu cầu mượn", "Đã duyệt, chờ lấy", "Từ chối", "Đang mượn", "Đã trả", "Quá hạn", "Đã hủy"),
        allowNull: false,
        defaultValue: "Đang yêu cầu mượn",
    },

    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "books",
            key: "id"
        }
    },
    borrow_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },

    approver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,

    }
}, {
    tableName: "borrows",
    timestamps: true
})


module.exports = Borrow;