const { Router} = require("express");
const AuthorController = require("../controllers/AuthorController");


const router = Router();

router.get("/", AuthorController.index);
router.get("/add", AuthorController.add);
router.get("/edit/:id", AuthorController.edit);
router.get("/delete/:id", AuthorController.delete);
router.get('/:id', AuthorController.detail);
router.post("/add", AuthorController.addPost);
router.post("/edit/:id", AuthorController.editPost);
router.post("/delete/:id", AuthorController.deletePost);

module.exports = router;
