const { Borrow, Book, User, Fine } = require("../models");

class BorrowController {
    // Hiển thị danh sách phiếu mượn
    static async indexReader(req, res) {
        const user_id = req.user.user_id;
        const borrows = await Borrow.findAll({
            where: { borrow_id: user_id },
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        console.log(borrows);

        res.render("borrow/reader/index", { title: "Quản lý phiếu mượn", borrows });
    }


    // Hiển thị form thêm phiếu mượn
    static async addReader(req, res) {
        const books = await Book.findAll();
        const users = await User.findAll();
        res.render("borrow/reader/add", { title: "Thêm phiếu mượn", books, users });
    }

    // Hiển thị form chỉnh sửa phiếu mượn
    static async editReader(req, res) {
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId);
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

        const books = await Book.findAll();
        const users = await User.findAll();

        res.render("borrow/reader/edit", { title: "Chỉnh sửa phiếu mượn", borrow, books, users });
    }

    // Hiển thị form xóa phiếu mượn
    static async deleteReader(req, res) {
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId, {
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

        res.render("borrow/reader/delete", { title: "Xóa phiếu mượn", borrow });
    }

    // Hiển thị chi tiết phiếu mượn
    static async detailReader(req, res) {
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId, {
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

        res.render("borrow/reader/detail", { title: "Chi tiết phiếu mượn", borrow });
    }

    // Xử lý POST thêm phiếu mượn
    static async addReaderPost(req, res) {
        try {
            const borrow_id = req.user.user_id;
            const { book_id, borrow_date, due_date } = req.body;
            await Borrow.create({ book_id, borrow_date, due_date, borrow_id });
            res.redirect("/borrows/reader");
        } catch (error) {
            console.log(error);

        }
    }


    // Xử lý POST hủy phiếu mượn
    static async deleteReaderPost(req, res) {
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId);
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        if (borrow.status !== "Đang yêu cầu mượn") {
            return res.status(400).send("Chỉ có thể hủy phiếu mượn đang yêu cầu mượn");
        }
        await borrow.update({ status: "Đã hủy" })

        res.redirect("/borrows/reader");
    }
    static async indexLibrarian(req, res) {
        const borrows = await Borrow.findAll({
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        res.render("borrow/librarian/index", { title: "Quản lý phiếu mượn", borrows });
    }

    static async detailLibrarian(req, res) {
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId, {
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' },
                { model: Fine, as: 'fine' },
            ]
        });
        console.log(borrow);
        
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");

        res.render("borrow/librarian/detail", { title: "Chi tiết phiếu mượn", borrow });
    }

    static async updateLibrarian(req, res) {
        const approver_id = req.user.user_id;
        const borrowId = req.params.id;
        // const { status, return_date, pickup_date } = req.body;
        const borrow = await Borrow.findByPk(borrowId, {
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        // await borrow.update({ status, return_date, pickup_date, approver_id });
        return res.render("borrow/librarian/update", { title: "Cập nhật phiếu mượn", borrow });
    }
    static async acceptBorrowPost(req, res) {
        const approver_id = req.user.user_id;
        const borrowId = req.params.id;
        // const { status, return_date, pickup_date } = req.body;
        const borrow = await Borrow.findByPk(borrowId);
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        await borrow.update({ status: "Đã duyệt, chờ lấy", approver_id });
        res.redirect("/borrows/librarian");
    }
    static async rejectBorrowPost(req, res) {
        const approver_id = req.user.user_id;
        const borrowId = req.params.id;
        const borrow = await Borrow.findByPk(borrowId);
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        await borrow.update({ status: "Từ chối", approver_id });
        res.redirect("/borrows/librarian");
    }
    static async markAsExpiredPost(req, res) {
        const approver_id = req.user.user_id;
        const borrowId = req.params.id;
        // const { status, return_date, pickup_date } = req.body;
        const borrow = await Borrow.findByPk(borrowId, {
            include: {
                model: Fine, as: 'fine'
            }
        });
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        if (!borrow.fine) {
            await Fine.create({ amount: 50000, isPaid: false, borrow_id: borrow.id });
        }
        await borrow.update({ status: "Quá hạn", approver_id });
        res.redirect("/borrows/librarian");
    }
     static async updateLibrarianPost(req, res) {
        const approver_id = req.user.user_id;
        const borrowId = req.params.id;
        const { status, return_date = null, pickup_date = null } = req.body;
        const borrow = await Borrow.findByPk(borrowId, {
            include: [
                { model: Book, as: 'book' },
                { model: User, as: 'borrower' },
                { model: User, as: 'approver' }
            ]
        });
        if (!borrow) return res.status(404).send("Phiếu mượn không tồn tại");
        
        await borrow.update({ status, return_date, pickup_date, approver_id: borrow.approver_id ? borrow.approver_id : approver_id });
        return res.redirect("/borrows/librarian");  
    }


}

module.exports = BorrowController;
