const { Category } = require("../models");
const CategoryRepository = require("../repositories/CategoryRepository");

class CategoryService {
  static async getAllCategories({ search = "", sort = "", page = 1, limit = 5 } = {}) {
    try {
      const sortBy = "createdAt";
      const order = sort === "DESC" ? "DESC" : "ASC";
      const categories = await CategoryRepository.findAll({
        search,
        sortBy,
        order,
        page,
        limit,
      });
      return categories;
    } catch (error) {
      console.log(error.message);

      return {
        count: 0,
        rows: [],
      };
    }
  }
  static async getAllNoPagination() {
    try {
      const categories = await CategoryRepository.findAllNoPagination();
      return categories;
    } catch (error) {
      console.log(error.message);

      return {
        count: 0,
        rows: [],
      };
    }
  }
  static async getCategoryById(id) {
    try {
      const category = await CategoryRepository.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error) {
      throw error;
    }
  }
  static async getCategoryByIdWithBooks(id) {
    try {
      const category = await CategoryRepository.findByIdWithBooks(id);
      if(!category) {
        throw new Error("Category not found");
      }

      return category;
    } catch (error) {
      throw error;
    }
  }
  static async createCategory(categoryData) {
    try {
      const newCategory = await CategoryRepository.create(categoryData);
      return newCategory;
    } catch (error) {
      throw error;
    }
  }
  static async updateCategory(id, categoryData) {
    try {
      const category = await CategoryRepository.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      await category.update(categoryData);
      return category;
    } catch (error) {
      throw error;
    }
  }
  static async deleteCategory(id) {
    try {
      const category = await CategoryRepository.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      await CategoryRepository.delete(id);
      return category;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
