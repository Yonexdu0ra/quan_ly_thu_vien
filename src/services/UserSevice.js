const { User } = require("../models");




class UserService {
    static async getAllUsers() {
        try {
            const users = await User.findAll({});
            return users;
        } catch (error) {
            return [];
        }
    }
    static async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            return null;
        }
    }
    static async updateUser(id, userData) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }
            await user.update(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }
    static async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }
            await user.destroy();
            return user;
        } catch (error) {
            throw error;
        }
    }
}
