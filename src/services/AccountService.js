const { Account } = require("../models");



class AccountService {

    static async getAllAccounts() {
        try {
            const accounts = await Account.findAll({});
            return accounts;
        } catch (error) {
            return [];
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
    static async createAccount(accountData) {
        try {
            const newAccount = await Account.create(accountData);
            return newAccount;
        } catch (error) {
            throw error;
        }
    }
    static async updateAccount(id, accountData) {
        try {
            const account = await Account.findByPk(id);
            if (!account) {
                return null;
            }
            await account.update(accountData);
            return account;
        } catch (error) {
            throw error;
        }
    }
    static async deleteAccount(id) {
        try {
            const account = await Account.findByPk(id);
            if (!account) {
                return null;
            }
            await account.destroy();
            return account;
        } catch (error) {
            throw error;
        }
    }
    static async getAccountByUsername(username) {
        try {
            const account = await Account.findOne({ where: { username } });
            return account;
        } catch (error) {
            return null;
        }
    }
}

module.exports = AccountService;    