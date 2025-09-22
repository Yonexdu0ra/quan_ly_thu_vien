const bcrypt = require("bcrypt");
const { Account, User, sequelize } = require("../models");


class AccountService {

    static async getAllAccounts(search, sortBy, sortOrder, page = 1, pageSize = 10) {
        try {
            const accounts = await Account.findAndCountAll();
            return accounts;
        } catch (error) {
            return {
                count: 0, rows: []
            };
        }
    }
    static async getAccountById(id) {
        try {
            const account = await Account.findByPk(id);
            return account;
        } catch (error) {
            return null;
        }
    }
    static async createAccount(data) {
        const transaction = await sequelize.transaction();
        try {
            const user = await User.create({
                fullname: data.fullname,
                email: data.email,
                phone: data.phone,
                address: data.address,
            }, { transaction });

            const account = await Account.create({
                username: data.username,
                password: await bcrypt.hash(data.password, 10),
                role: data.role,
                userId: user.id
            }, { transaction });

            await transaction.commit();
            return {
                account: account,
                user: user
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    static async updateAccount(id, accountData) {
        const transaction = await sequelize.transaction();
        try {
            const account = await Account.findByPk(id, {
                include: [{ model: User, as: 'user' }]
            });
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            await account.update({
                ...accountData,
            }, { fields: ['role'], transaction });
            await account.user.update({
                ...accountData,
            }, { fields: ['fullname', 'email', 'phone', 'address'], transaction });
            await transaction.commit();
            return account;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    static async deleteAccount(id) {
        try {
            const account = await Account.findByPk(id);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            await account.destroy();
            return account;
        } catch (error) {
            throw error;
        }
    }
    static async getAccountByUsername(username) {
        try {
            const account = await Account.findOne({ where: { username }, include: [{ model: User, as: 'user', attributes: ['fullname'] }] });
            return account;
        } catch (error) {
            return null;
        }
    }
}

module.exports = AccountService;    