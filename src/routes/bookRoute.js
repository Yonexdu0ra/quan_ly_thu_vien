const { Router} = require("express");
const BookController = require("../controllers/BookController");


const router = Router();
router.get("/", BookController.index);
router.get("/add", BookController.add);
router.get("/edit/:id", BookController.edit);
router.get("/delete/:id", BookController.delete);
router.get('/:id', BookController.detail);
router.post("/add", BookController.addPost);
router.post("/edit/:id", BookController.editPost);
router.post("/delete/:id", BookController.deletePost);



module.exports = router;
