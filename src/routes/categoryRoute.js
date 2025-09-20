const { Router} = require("express");
const CategoryController = require("../controllers/CategoryController");


const router = Router();
router.get("/", CategoryController.index);
router.get("/add", CategoryController.add);
router.get("/edit/:id", CategoryController.edit);
router.get("/delete/:id", CategoryController.delete);
router.get('/:id', CategoryController.detail);
router.post("/add", CategoryController.addPost);
router.post("/edit/:id", CategoryController.editPost);
router.post("/delete/:id", CategoryController.deletePost);


module.exports = router;
