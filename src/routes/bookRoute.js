const { Router } = require("express");
const BookController = require("../controllers/BookController");
const upload = require("../config/multer");
const { requireRoleLibrarianOrAdmin } = require("../middleware/authorization");


const router = Router();
router.get("/", requireRoleLibrarianOrAdmin, BookController.index);
router.get("/add",requireRoleLibrarianOrAdmin, BookController.add);
router.get("/edit/:id", requireRoleLibrarianOrAdmin,BookController.edit);
router.get("/delete/:id", requireRoleLibrarianOrAdmin,BookController.delete);
router.get('/:id', BookController.detail);
router.post("/add",requireRoleLibrarianOrAdmin, upload.single('image_cover'), BookController.addPost);
router.post("/edit/:id",requireRoleLibrarianOrAdmin, upload.single('image_cover'), BookController.editPost);
router.post("/delete/:id", requireRoleLibrarianOrAdmin, BookController.deletePost);



module.exports = router;
