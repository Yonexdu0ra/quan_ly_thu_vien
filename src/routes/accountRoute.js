const { Router } = require("express");
const router = Router();
const AccountController = require("../controllers/AccountController");

router.get("/", AccountController.index);
router.get("/add", AccountController.add);
router.post("/add", AccountController.addPost);
router.get("/edit/:id", AccountController.edit);
router.post("/edit/:id", AccountController.editPost);
router.get("/detail/:id", AccountController.detail);
router.get("/delete/:id", AccountController.delete);
router.post("/delete/:id", AccountController.deletePost);

module.exports = router;