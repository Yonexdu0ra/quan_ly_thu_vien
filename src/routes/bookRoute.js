const { Router } = require("express");
const BookController = require("../controllers/BookController");
const upload = require("../config/multer");


const router = Router();
router.get("/", BookController.index);
router.get("/add", BookController.add);
router.get("/edit/:id", BookController.edit);
router.get("/delete/:id", BookController.delete);
router.get('/:id', BookController.detail);
router.post("/add", upload.single('image_cover'), BookController.addPost);
router.post("/edit/:id", upload.single('image_cover'), BookController.editPost);
router.post("/delete/:id", BookController.deletePost);



module.exports = router;
