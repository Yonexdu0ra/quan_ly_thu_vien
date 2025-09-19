const { Category } = require("../models");



class CategoryService {
    static async getAllCategories() {
        try {
            const categories = await Category.findAll({});
            return categories;
        } catch (error) {
            return [];
        }
    }
    static async getCategoryById(id) {
        try {
            const category = await Category.findByPk(id);
            return category;
        } catch (error) {
            return null;
        }
    }
    static async createCategory(categoryData) {
        try {
            const newCategory = await Category.create(categoryData);
            return newCategory;
        } catch (error) {
            throw error;
        }
    }
    static async updateCategory(id, categoryData) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return null;
            }
            await category.update(categoryData);
            return category;
        } catch (error) {
            throw error;
        }

    }
    static async deleteCategory(id) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return null;
            }
            await category.destroy();
            return category;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CategoryService