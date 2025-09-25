const { Router } = require("express");
const router = Router();
const BorrowController = require("../controllers/BorrowController");
const { requireRoleLibrarianOrAdmin } = require("../middleware/authorization");

router.get("/reader", BorrowController.indexReader);
router.get("/reader/add", BorrowController.addReader);
router.get("/reader/cancel/:id", BorrowController.viewMarkAsCancelled);
router.get("/reader/detail/:id", BorrowController.detailReader);
router.post("/reader/cancel", BorrowController.markAsCancelled);


router.post("/reader/add", BorrowController.addReaderPost);
router.post("/reader/cancel/:id", BorrowController.markAsCancelled);


router.get("/librarian", requireRoleLibrarianOrAdmin, BorrowController.indexLibrarian);
router.get("/librarian/edit/:id", requireRoleLibrarianOrAdmin, BorrowController.updateLibrarian);
router.get("/librarian/detail/:id", requireRoleLibrarianOrAdmin, BorrowController.detailLibrarian);
router.get("/librarian/approve/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsAcceptedPost);
router.get("/librarian/reject/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsRejectedPost);
router.get("/librarian/pickup/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsPickedUp);
router.get("/librarian/return/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsReturned);
router.get("/librarian/expire/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsExpiredPost);
router.get("/librarian/renew/:id", requireRoleLibrarianOrAdmin, BorrowController.markAsRenewDueDate);
// router.post("/librarian/edit/:id", requireRoleLibrarianOrAdmin, BorrowController.updateLibrarianPost);

module.exports = router;
