const UserRepository = require("../repositories/UserRepository");

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAll();
  }
  static async getUserById(userId) {
    return await UserRepository.findById(userId);
  }
  static async createUser(userData) {
    return await UserRepository.create(userData);
  }
  static async updateUser(userId, userData) {
    try {
      const user = await UserRepository.findById(userId);
     
      
      if (!user) {
        throw new Error("User not found");
      }

      return await UserRepository.update(userId, userData);
    } catch (error) {
      throw error;
    }
  }
  static async deleteUser(userId) {
    return await UserRepository.delete(userId);
  }
}

module.exports = UserService;
