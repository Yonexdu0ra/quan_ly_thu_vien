const { Router } = require("express");
const FineController = require("../controllers/FineController");
const { requireRoleLibrarianOrAdmin } = require("../middleware/authorization");

const router = Router();

router.get("/", FineController.index);
// router.get("/add",requireRoleLibrarianOrAdmin, FineController.add);
// router.post("/add",requireRoleLibrarianOrAdmin, FineController.addPost);
router.get("/edit/:id",requireRoleLibrarianOrAdmin, FineController.edit);
router.post("/edit/:id",requireRoleLibrarianOrAdmin, FineController.editPost);
router.get("/:id", FineController.detail);

module.exports = router;
