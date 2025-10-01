const { Fine } = require("../models");
const FineRepository = require("../repositories/fineRepository");


class FineService {
    static async getAllFinesWithBorrowerAndBookAndUser({ search = "", sort = '', page = 1, limit = 5 } = {}, options = {}) {
        try {
            const sortBy = sort.split('-')[0] || 'amount';
            const order = sort.split('-')[1] === "ASC" ? "ASC" : "DESC";
            const fines = await FineRepository.findAllWithBorrowerAndBookAndUser({ search, sortBy, order, page, limit }, options);
            return fines;
        } catch (error) {
            console.error(error.message);
            return { count: 0, rows: []};
        }
    }
    static async getAllByIdFinesWithBorrowerAndBookAndUser(user_id, { search = "", sort = '', page = 1, limit = 5 } = {}, options = {}) {
        try {
            const sortBy = sort.split('-')[0] || 'amount';
            const order = sort.split('-')[1] === "ASC" ? "ASC" : "DESC";
            const fines = await FineRepository.findAllByUserIdWithBorrowerAndBookAndUser(user_id, { search, sortBy, order, page, limit }, options);
            return fines;
        } catch (error) {
            console.error(error.message);
            return { count: 0, rows: []};
        }
    }
    static async getFineById(id) {
        try {
            const fine = await FineRepository.findById(id);
            if(!fine) throw new Error('Fine not found');
            return fine;
        } catch (error) {
            throw error;
        }
    }
    static async getFineByIdFineWithBorrowerAndBookAndUser(id) {
        try {

            const fine = await FineRepository.findByIdWithBorrowerAndBookAndUser(id);
            if(!fine) throw new Error('Fine not found');
            return fine;
        } catch (error) {
            throw error;
        }
    }
    static async createFine(fineData) {
        try {
            const newFine = await FineRepository.create(fineData);
            return newFine;
        } catch (error) {
            throw error;
        }
    }
    static async updateFine(id, fineData) {
        try {
            const fine = await FineRepository.findById(id);
            if (!fine) {
                throw new Error('Fine not found');
            }
            await FineRepository.update(id, fineData);
            
            return fine;
        } catch (error) {
            throw error;
        }
    }
    // static async deleteFine(id) {
    //     try {
    //         const fine = await Fine.findByPk(id);
    //         if (!fine) {
    //             return null;
    //         }
    //         await fine.destroy();
    //         return fine;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = FineService;
