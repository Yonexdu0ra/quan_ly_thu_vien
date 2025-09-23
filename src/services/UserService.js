
const UserRepository = require("../repositories/UserRepository");


class UserService {
    static async getAllUsers() {
        // Giả sử có mô hình User đã được định nghĩa
        return await UserRepository.findAll();
    }
    static async getUserById(userId) {
        return await UserRepository.findById(userId);
    }
    static async createUser(userData) {
        return await UserRepository.create(userData);
    }
    static async updateUser(userId, userData) {
        return await UserRepository.update(userId, userData);
    }
    static async deleteUser(userId) {
        return await UserRepository.delete(userId);
    }
}


module.exports = UserService;