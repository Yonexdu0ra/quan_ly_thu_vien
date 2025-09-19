const { Fine } = require("../models");


class FineService {
    static async getAllFines() {
        try {
            const fines = await Fine.findAll({});
            return fines;
        } catch (error) {
            return [];
        }
    }
    static async getFineById(id) {
        try {
            const fine = await Fine.findByPk(id);
            return fine;
        } catch (error) {
            return null;
        }
    }
    static async createFine(fineData) {
        try {
            const newFine = await Fine.create(fineData);
            return newFine;
        } catch (error) {
            throw error;
        }
    }
    static async updateFine(id, fineData) {
        try {
            const fine = await Fine.findByPk(id);
            if (!fine) {
                return null;
            }
            await fine.update(fineData);
            return fine;
        } catch (error) {
            throw error;
        }
    }
    static async deleteFine(id) {
        try {
            const fine = await Fine.findByPk(id);
            if (!fine) {
                return null;
            }
            await fine.destroy();
            return fine;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FineService;
