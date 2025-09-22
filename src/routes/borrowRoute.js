const { Router } = require("express");
const router = Router();
const BorrowController = require("../controllers/BorrowController");
const { requireRoleLibrarianOrAdmin } = require("../middleware/authorization");

router.get("/reader", BorrowController.indexReader);
router.get("/reader/add", BorrowController.addReader);
router.get("/reader/edit/:id", BorrowController.editReader);
router.get("/reader/cancel/:id", BorrowController.deleteReader);
router.get("/reader/detail/:id", BorrowController.detailReader);


router.post("/reader/add", BorrowController.addReaderPost);
router.post("/reader/cancel/:id", BorrowController.deleteReaderPost);


router.get("/librarian", requireRoleLibrarianOrAdmin, BorrowController.indexLibrarian);
router.get("/librarian/edit/:id", requireRoleLibrarianOrAdmin, BorrowController.updateLibrarian);
router.get("/librarian/detail/:id", requireRoleLibrarianOrAdmin, BorrowController.detailLibrarian);
router.get("/librarian/approve/:id", requireRoleLibrarianOrAdmin, BorrowController.acceptBorrowPost);
router.get("/librarian/reject/:id", requireRoleLibrarianOrAdmin, BorrowController.rejectBorrowPost);
router.get("/librarian/expire/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsExpiredPost);
router.post("/librarian/edit/:id", requireRoleLibrarianOrAdmin, BorrowController.updateLibrarianPost);

module.exports = router;
