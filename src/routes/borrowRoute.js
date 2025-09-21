const { Router } = require("express");
const router = Router();
const BorrowController = require("../controllers/BorrowController");
const { requiredRoleLibraries } = require("../middleware/authorization");

router.get("/reader", BorrowController.indexReader);
router.get("/reader/add", BorrowController.addReader);
router.get("/reader/edit/:id", BorrowController.editReader);
router.get("/reader/cancel/:id", BorrowController.deleteReader);
router.get("/reader/detail/:id", BorrowController.detailReader);


router.post("/reader/add", BorrowController.addReaderPost);
router.post("/reader/cancel/:id", BorrowController.deleteReaderPost);


router.get("/librarian", requiredRoleLibraries, BorrowController.indexLibrarian);
router.get("/librarian/edit/:id", requiredRoleLibraries, BorrowController.updateLibrarian);
router.get("/librarian/detail/:id", requiredRoleLibraries, BorrowController.detailLibrarian);
router.get("/librarian/approve/:id", requiredRoleLibraries, BorrowController.acceptBorrowPost);
router.get("/librarian/reject/:id", requiredRoleLibraries, BorrowController.rejectBorrowPost);
router.get("/librarian/expire/:id", requiredRoleLibraries, BorrowController.markAsExpiredPost);
router.post("/librarian/edit/:id", requiredRoleLibraries, BorrowController.updateLibrarianPost);

module.exports = router;
