const bcrypt = require("bcrypt");
const { Account, User, sequelize } = require("../models");
const AccountRepository = require("../repositories/AccountRepository");

class AccountService {

    static async getAllAccounts(search, sort, page = 1, pageSize = 10) {
        try {
            const sortBy = "createdAt";
            const order = sort === "ASC" ? "ASC" : "DESC";
            const account = await AccountRepository.findAll({ search, sortBy, order, page, pageSize });
            return account;
        } catch (error) {
            console.log(error.message);

            return {
                count: 0, rows: []
            };
        }
    }
    static async getAccountByIdWithUser(id) {
        return await AccountRepository.findByIdWithUser(id);
    }
    static async getAccountById(id) {
        try {
            const account = await AccountRepository.findById(id);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            return account;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    static async createAccount(data, options = {}) {
        try {

            const account = await AccountRepository.create({
                username: data.username,
                password: await bcrypt.hash(data.password, 10),
                role: data.role,
                userId: user.id
            }, { ...options });


            return account
        } catch (error) {
            throw error;
        }
    }
    static async updateAccount(id, accountData, options = {}) {
        try {
            const account = await AccountRepository.findById(id);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            await AccountRepository.update(id, accountData, options);
            return account;
        } catch (error) {
            throw error;
        }
    }
    static async deleteAccount(id, options = {}) {
        try {
            const account = await AccountRepository.findById(id);
            if (!account) {
                throw new Error("Tài khoản không tồn tại");
            }
            return await AccountRepository.delete(id, options);

        } catch (error) {
            throw error;
        }
    }
    static async getAccountByUsername(username) {
        try {
            const account = await AccountRepository.findByUsername(username);

            return account;
        } catch (error) {
            throw null;
        }
    }

}

module.exports = AccountService;    