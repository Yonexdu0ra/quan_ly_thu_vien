const { Borrow } = require("../models");





class BorrowService {
    static async getAllBorrows() {
        try {
            const borrows = await Borrow.findAll({});
            return borrows;
        } catch (error) {
            return [];
        }
    }
    static async getBorrowById(id) {
        try {
            const borrow = await Borrow.findByPk(id);
            return borrow;
        } catch (error) {
            return null;
        }
    }
    static async createBorrow(borrowData) {
        try {
            const newBorrow = await Borrow.create(borrowData);
            return newBorrow;
        } catch (error) {
            throw error;
        }
    }
    static async updateBorrow(id, borrowData) {
        try {
            const borrow = await Borrow.findByPk(id);
            if (!borrow) {
                return null;
            }
            await borrow.update(borrowData);
            return borrow;
        } catch (error) {
            throw error;
        }
    }
    static async deleteBorrow(id) {
        try {
            const borrow = await Borrow.findByPk(id);
            if (!borrow) {
                return null;
            }
            await borrow.destroy();
            return borrow;
        } catch (error) {
            throw error;
        }
    }
}
