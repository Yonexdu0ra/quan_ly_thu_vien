const { Fine, Borrow} = require("../models");


const FineController = {
  // Hiển thị danh sách fines
  index: async (req, res) => {
    try {
      const fines = await Fine.findAll({
        include: {
            model: Borrow,
            as: 'borrow'
        }, // nếu bạn có liên kết Fine.belongsTo(Borrow)
        order: [["createdAt", "DESC"]],
      });
      res.render("fine/index", { fines, title: "Quản lý fines" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Form thêm fine
  add: async (req, res) => {
    try {
      const borrows = await Borrow.findAll(); // để chọn borrow_id
      res.render("fine/add", { borrows, title: "Thêm fine" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Xử lý thêm fine
  addPost: async (req, res) => {
    try {
      await Fine.create({
        amount: req.body.amount,
        isPaid: req.body.isPaid ? true : false,
        borrow_id: req.body.borrow_id,
      });
      res.redirect("/fines");
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Form edit fine
  edit: async (req, res) => {
    try {
      const fine = await Fine.findByPk(req.params.id);
      const borrows = await Borrow.findAll();
      if (!fine) return res.status(404).send("Không tìm thấy fine");
      res.render("fine/edit", { fine, borrows, title: "Chỉnh sửa fine" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Xử lý update fine
  editPost: async (req, res) => {
    try {
      await Fine.update(
        {
          amount: req.body.amount,
          isPaid: req.body.isPaid ? true : false,
          borrow_id: req.body.borrow_id,
        },
        { where: { id: req.params.id } }
      );
      res.redirect("/fines");
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Xem chi tiết fine
  detail: async (req, res) => {
    try {
      const fine = await Fine.findByPk(req.params.id, {
        include: {
            model: Borrow,
            as: 'borrow'
        },
      });
      console.log(fine);
      
      if (!fine) return res.status(404).send("Không tìm thấy fine");
      res.render("fine/detail", { fine, title: "Chi tiết fine" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Form confirm delete
  delete: async (req, res) => {
    try {
      const fine = await Fine.findByPk(req.params.id);
      if (!fine) return res.status(404).send("Không tìm thấy fine");
      res.render("fine/delete", { fine });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },

  // Xử lý delete fine
  deletePost: async (req, res) => {
    try {
      await Fine.destroy({ where: { id: req.params.id } });
      res.redirect("/fines");
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  },
};

module.exports = FineController;
