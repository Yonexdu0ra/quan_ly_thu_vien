const { Router } = require("express");
const FineController = require("../controllers/FineController");

const router = Router();

router.get("/", FineController.index);
router.get("/add", FineController.add);
router.post("/add", FineController.addPost);
router.get("/edit/:id", FineController.edit);
router.post("/edit/:id", FineController.editPost);
router.get("/delete/:id", FineController.delete);
router.post("/delete/:id", FineController.deletePost);
router.get("/:id", FineController.detail);

module.exports = router;
