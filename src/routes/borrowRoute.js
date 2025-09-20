const { Router } = require("express");
const router = Router();
const BorrowController = require("../controllers/BorrowController");

router.get("/reader", BorrowController.indexReader);
router.get("/reader/add", BorrowController.addReader);
router.get("/reader/edit/:id", BorrowController.editReader);
router.get("/reader/cancel/:id", BorrowController.deleteReader);
router.get("/reader/detail/:id", BorrowController.detailReader);


router.post("/reader/add", BorrowController.addReaderPost);
router.post("/reader/cancel/:id", BorrowController.deleteReaderPost);


router.get("/librarian", BorrowController.indexLibrarian);

module.exports = router;
