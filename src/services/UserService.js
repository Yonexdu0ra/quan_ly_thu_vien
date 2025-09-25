const UserRepository = require("../repositories/UserRepository");

class UserService {
  static async getAllUsers({ search = "", sort, page = 1, limit = 5 } = {}) {
    try {
      const sortBy = "createdAt";
      const order = sort === "ASC" ? "ASC" : "DESC";
      return await UserRepository.findAll({ search, sortBy, order, page, limit });
    } catch (error) {
      console.error(error.message);
      return { count: 0, rows: [] };
    }
  }
  static async getUserById(userId) {
    return await UserRepository.findById(userId);
  }
  static async createUser(userData, options = {}) {
    return await UserRepository.create(userData, options);
  }
  static async updateUser(userId, userData, options = {}) {
    try {
      const user = await UserRepository.findById(userId);


      if (!user) {
        throw new Error("User not found");
      }

      return await UserRepository.update(userId, userData, options);
    } catch (error) {
      throw error;
    }
  }
  static async deleteUser(userId, options = {}) {
    return await UserRepository.delete(userId, options);
  }
}

module.exports = UserService;
